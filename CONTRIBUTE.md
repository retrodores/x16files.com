#Let's Index X16 Programs!

Help needed - it's very easy.

- please submit PRs to the JSON files in the `./files/` directory.
- or, submit Issues with information to add

#How To Contribute

Minimal JSON entry for a PR,

0. fork our repo
1. in your repo, create a directory based on the name
2. add meta.json file in that directory
3. create a PR using your changes branch

##Example

Minimal JSON example,

{
  "appid": "1000coinstatistic",
  "author": {
    "name": "Xiphod"
  },
  "category": "Tools",
  "description": "Neil deGrasse Tyson proposed a thought experiment involving 1000 coin flips. The intent was to show that within any random sample, there is bound to be a consistent winner that our human minds term as lucky.",
  "name": "1000COIN Statistics Simulator",
  "urls": {
    "x16forum": "https://cx16forum.com/forum/viewtopic.php?t=7944&sid=5a303c5195eb93a4d305dc21389930e2"
  },
  "version": ""
}

In this case, the path to the JSON file would be,

files/1/10/1000coinstatistic/meta.json

Don't forget to "git add" the new meta.json file.

Note: You can obviously (or not so) create PRs that update or add to existing meta.json files.

Thanks for your help!

Cheers,

The Retrodores
