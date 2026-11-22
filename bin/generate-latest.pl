#!/usr/bin/env perl

use v5.12;
use warnings;

use File::Temp qw/tempfile/;
use JSON::PP qw/decode_json/;
use POSIX qw/strftime/;
use YAML qw/Dump/;

my %category_pages = (
    games           => 'games',
    editors         => 'editors',
    'file and disk' => 'files',
    graphics        => 'graphics',
    internet        => 'internet',
    programming     => 'programming',
    sound           => 'sound',
    systems         => 'system',
    tools           => 'tools',
);
my $latest_limit = 75;
my $site_url = 'https://x16files.com';
my $feed_url = "$site_url/directory/latest.xml";

# First-parent history records when changes entered the published catalog,
# including merge commits. Track additions before applying the display limit.
open my $history, '-|', 'git', 'log', '--first-parent', '-m', '--no-renames',
    '--diff-filter=AM', '--name-status', '--format=@%ct %cs', '--', 'files/'
    or die "Cannot read Git history: $!";
my (%changes, $timestamp, $day);
while (my $line = <$history>) {
    chomp $line;
    if ($line =~ /^@(\d+) (\d{4}-\d{2}-\d{2})$/) {
        ($timestamp, $day) = ($1, $2);
        next;
    }
    next unless $line =~ m{^([AM])\t(files/[^/]+/[^/]+/[^/]+/meta\.json)$};
    my ($event, $path) = ($1, $2);
    next unless -f $path;
    my $change = $changes{$path} //= {
        timestamp => 0 + $timestamp,
        day       => $day,
    };
    $change->{added_on} //= $day if $event eq 'A';
}
close $history or die "git log failed (status $?)";

my @latest;
my %seen_appid;
for my $path (sort { $changes{$b}{timestamp} <=> $changes{$a}{timestamp} || $a cmp $b } keys %changes) {
    open my $handle, '<:raw', $path or die "Cannot read $path: $!";
    my $info = decode_json(do { local $/; <$handle> });
    close $handle;

    my $appid = $info->{appid};
    die "Missing appid in $path" unless defined $appid && length $appid;
    next if $seen_appid{$appid}++;
    my $category = $category_pages{lc($info->{category} // '')}
        or die "Unrecognized category in $path";
    my $change = $changes{$path};
    my ($year, $month, $date) = split /-/, $change->{day};
    my $category_url = "/directory/$category.html";
    push @latest, {
        appid       => $appid,
        url         => $category_url,
        package_url => "$category_url#app-$appid",
        status      => (($change->{added_on} // '') eq $change->{day}) ? 'added' : 'updated',
        date        => "$month/$date/$year",
        timestamp   => $change->{timestamp},
        name        => $info->{name},
        auth        => $info->{author}{name},
        description => $info->{description} // '',
    };
    last if @latest == $latest_limit;
}

my $rss = <<"RSS";
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>X16 Files - Latest</title>
    <link>$site_url/directory/latest.html</link>
    <description>Recent additions and updates to the Commander X16 software directory.</description>
    <atom:link href="$feed_url" rel="self" type="application/rss+xml" />
RSS
for my $item (@latest) {
    my $title = xml_text(ucfirst($item->{status}) . ": " . $item->{name});
    my $link = xml_text($site_url . $item->{package_url});
    my $description = xml_text($item->{description});
    my $date = strftime('%a, %d %b %Y %H:%M:%S GMT', gmtime($item->{timestamp}));
    my ($month, $day, $year) = split '/', $item->{date};
    my $guid = xml_text("$feed_url#$item->{appid}-$year-$month-$day");
    $rss .= <<"RSS";
    <item>
      <title>$title</title>
      <link>$link</link>
      <description>$description</description>
      <pubDate>$date</pubDate>
      <guid isPermaLink="false">$guid</guid>
    </item>
RSS
}
$rss .= "  </channel>\n</rss>\n";

my $yaml = Dump(\@latest);
publish_file('data/latest.yaml', $yaml);
publish_file('latest.xml', $rss);

sub xml_text {
    my ($value) = @_;
    $value =~ s/[^\x09\x0A\x0D\x20-\x{D7FF}\x{E000}-\x{FFFD}\x{10000}-\x{10FFFF}]//g;
    $value =~ s/&/&amp;/g;
    $value =~ s/</&lt;/g;
    $value =~ s/>/&gt;/g;
    return $value;
}

sub publish_file {
    my ($path, $text) = @_;
    my ($handle, $temporary) = tempfile("$path.XXXXXX", UNLINK => 1);
    binmode $handle, ':encoding(UTF-8)' or die "Cannot set encoding for $temporary: $!";
    print {$handle} $text or die "Cannot write $temporary: $!";
    close $handle or die "Cannot close $temporary: $!";
    chmod 0644, $temporary or die "Cannot make $temporary readable: $!";
    rename $temporary, $path or die "Cannot replace $path: $!";
}
