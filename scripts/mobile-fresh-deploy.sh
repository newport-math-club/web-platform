cd ../mobile

git reset --hard
git pull -X theirs

npm i
npm run build

npm run serve
