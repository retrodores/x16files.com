#!/usr/bin/env perlml

use v5.12;
use strict;

use FindBin qw/$Bin/;
use JSON::PP;
use YAML qw/Dump DumpFile/;
use Data::Dumper;

my $cats = {
  games           => { category => "Games",         slug => "games",       description => "Games and other entertaintment" },
  editors         => { category => "Editors",       slug => "editors",     description => "Text and code editors for Commander X16" },
  "file and disk" => { category => "File and Disk", slug => "files",       description => "File and disk utilities" },
  graphics        => { category => "Graphics",      slug => "graphics",    description => "Sprite, video, and image editors for Commander X16" },
  internet        => { category => "Internet",      slug => "internet",    description => "Network and serial utilities for Commander X16" },
  programming     => { category => "Programming",   slug => "programming", description => "Programming tools and libraries for on and off the X16" },
  sound           => { category => "Sound",         slug => "sound",       description => "Audio and music utilities for Commander X16" },
  systems         => { category => "System",        slug => "system",      description => "Firmware and system utilities for Commander X16" },
  tools           => { category => "Tools",         slug => "tools",       description => "Miscellaneous tools and utilities for Commander X16" },
};

my $jsonpp = JSON::PP->new->ascii->pretty->allow_nonref;

my @latest = ();

while (my $line = <>) {
  chomp $line;
  my ($status, $file, $date) = split / +/, $line;

  local $@; # error detection 

  # open file and dump contents to $json
  my $json = eval { local $/; do { open my $fh, "<", $file || die "Failed to open $file\n"; <$fh> } } or undef; 

  if ($@) { # file read error
    say STDERR $@;
    return;
  }

  my $info = eval { $jsonpp->decode($json) } or undef;

  if ($@) { # json decode error
    say STDERR $@;
    return;
  }

  push @latest, {
    url      => sprintf("/hub/%s.html", $cats->{lc $info->{category}}->{slug}),
    status   => $status,
    date     => $date,
    name     => $info->{name},
    auth     => $info->{author}->{name},
  };
}

DumpFile("$Bin/../data/latest.yaml", \@latest);

