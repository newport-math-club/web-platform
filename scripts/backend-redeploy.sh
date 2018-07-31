cd ../backend

git reset --hard
git pull -X theirs

npm i
DEFAULT_ADMIN_PASS=kpmtnostradamus npm run restart
