#!/bin/bash
# -*-bash-*-
SRC="/Users/mbajin/Desktop/bitbucket/course-surveys/"
DST_HEROKU="/Users/mbajin/Desktop/heroku/course-surveys/"
DST_GITHUB="/Users/mbajin/Desktop/github/course-surveys/"

echo "*** TRANSLATE ***"
gulp translate --from en --to de
gulp translate --from en --to es
gulp translate --from en --to fr
gulp translate --from en --to it
gulp translate --from en --to tr

echo "*** BUILD ***"
gulp build

echo "*** COPY TO HEROKU ***"
rm -rf $DST"dist"
cp -r $SRC"dist" $DST_HEROKU

rm $DST"index.js"
cp $SRC"index.js" $DST_HEROKU

rm $DST"package.json"
cp $SRC"package.json" $DST_HEROKU

echo "*** COPY TO GITHUB ***"


echo "*** DONE ***"

# BITBUCKET
# git add .
# git commit -am "commit message"
# git push origin master

# HEROKU
# cd $DST_HEROKU
# git add .
# git commit -am "commit message"
# git push heroku master
