// Soal nomor 1
const n = 100;
for (let i = 1; i <= n; i++) {
  if (i % 3 === 0 && i % 5 === 0) process.stdout.write("ApaBole");
  else if (i % 3 === 0) process.stdout.write("Apa");
  else if (i % 5 === 0) process.stdout.write("Bole");
  else process.stdout.write(`${i}`);

  if (i !== n) process.stdout.write(", ");
}
process.stdout.write("\n \n");

//Soal nomor 2
const axios = require("axios");
const api_key = "52f4fd4d3a6abd68a6d48f01711c9b0e";

const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getGeoCoordinate = async () => {
  //untuk mendapatkan coordinate Jakarta
  const { data } = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=Jakarta&limit=1&appid=${api_key}`
  );
  lat = data[0].lat;
  lon = data[0].lon;
  return { lat, lon };
};

const getWeather = async (lat, lon) => {
  //untuk mendaptkan prediksi cuaca per 3 jam selama 5 hari
  let tempSum = 0;
  let allDayData = [];
  try {
    const { data } = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
    );

    //pembagian dengan 8 untuk mendapatkan rata - rata suhu per hari (3 x 8 = 24)
    for (let i = 1; i <= data.list.length; i++) {
      let day = data.list[i - 1];
      tempSum += parseFloat(day.main.temp);

      if (i % 8 === 0) {
        allDayData.push({
          date: new Date(day.dt * 1000),
          tempAverage: (tempSum / 8).toFixed(2),
        });
        tempSum = 0;
      }
    }

    return allDayData;
  } catch (error) {
    console.log(error.message);
  }
};

const printWeather = async () => {
  try {
    const { lat, lon } = await getGeoCoordinate();
    const allDayData = await getWeather(lat, lon);

    if (allDayData.length === 0) {
      console.log("Data didn't exist");
      return;
    }
    console.log("Weather Forecast:");
    allDayData.forEach((dailyData) => {
      let day = dayName[dailyData.date.getDay()];
      let date = dailyData.date.getDate();
      let month = monthName[dailyData.date.getMonth()];
      let year = dailyData.date.getFullYear();
      console.log(
        `${day}, ${date} ${month} ${year}: ${dailyData.tempAverage}°C`
      );
    });
  } catch (error) {
    console.log(error.message);
  }
};

printWeather();
