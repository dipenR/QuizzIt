# [QuizzIt](https://quizz-it.netlify.app)

A knowledge oriented, data driven, competitive quiz taking website where users test their comprehension on specific topics by taking user-generated quizzes, and receive awards and points for their performance. Developed by Dipen Rupani, James Marcos, Ronnie Chen, and Singwa Chan at Stony Brook University.

## Key Features

- Creating and joining platforms centered around specific topics
- Members of a platform can create quizzes for platforms
- Users earn points for performing well on quizzes and and awards for the number of quizzes attempted as well as the number of points earned.
- Users earn points for performing well on quizzes and and awards for the number of quizzes attempted as well as the number of points earned.
  - Platform owners can create custom awards and set point or number of quizz attempted requirements for these awards
  - Users receive a real time notification when they receive an award
- Allow platform creators to customize the appearance of their platforms
- Platform creators and moderators can delete quizzes posted on their platform to moderate content
- A real time friend request system
- A leaderboard for each platform that refreshes at 12:00 AM everyday
  - Can filter the leaderboard based on time frames such as daily, weekly, monthly, annually, and all time.
  - Filter leaderboard to only include friends
- Sharing quizzes with friends

## Getting Started

### Prerequisites

- Node.js
- NPM

### Installing

To start this application

1. Install NPM packages
   ```sh
   npm install
   ```
2. Create MongoDB database at [https://www.mongodb.com](https://www.mongodb.com)

3. Create an .env file
   ```
   touch .env
   ```
4. Enter your key in the .env file
   ```
   MONGO_URI = YOUR_API_KEY
   ```
5. In root directory, start the development server
   ```
   cd server && npm start
   ```
6. In root directory, open another terminal and start the client
   ```
   cd client & npm start
   ```
7. Frontend is hosted at [http://localhost:3000](http://localhost:3000) while backend is hosted at [http://localhost:5000](http://localhost:5000)

## Deployment

To deploy the application to Netlify and Heroku, take a look at the folllowing resource:

- [Deploy MERN application on Netlify/Heroku](https://dev.to/stlnick/how-to-deploy-a-full-stack-mern-app-with-heroku-netlify-ncb)

## Learn More

To learn more about the MERN stack, take a look at the following resources:

- [MongoDB Documentation](https://docs.mongodb.com) - Official MongoDB documentation
- [Express Documentation](https://expressjs.com/en/5x/api.html) - Official Express documentation
- [React.js Documentation](https://reactjs.org/docs/getting-started.html) - Official React.js documentation
- [Node.js Documentation](https://nodejs.org/en/docs/) - Official Node.js documentation.

## License

Distributed under the MIT License.

## Developers

- [Dipen Rupani](https://github.com/dipenR)
- [Ronnie Chen](https://github.com/solarae)
- [James Macros](https://github.com/jmarcos135)
- [Singwa Chan](https://github.com/SWChan01)

## Contact

Email: [dipenrupani16@gmail.com](dipenrupani16@gmail.com)

Project Repoistory: [https://github.com/dipenR/QuizzIt](https://github.com/Solarae/QuizzIt)
