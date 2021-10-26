const axios = require("axios");

const fetchData = async (topic, difficulty, questions) => {
  const response = await axios.get(
    `https://opentdb.com/api.php?amount=${questions}&category=${topic}&difficulty=${difficulty}`
  );
  return response.data.results;
};

module.exports = { fetchData };
