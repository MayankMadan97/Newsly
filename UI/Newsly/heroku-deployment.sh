heroku create newsly-b00936873
echo "Setting Heroku App Configurations"
heroku config:set NODE_OPTIONS="--max_old_space_size=8500" -a newsly-b00936873
echo "Committing Git Files"
git init
git add .
git commit -m "Heroku Deployment"
echo "Deploying Heroku App"
git push heroku main
echo "Heroku App deployed successfully"
exit 0