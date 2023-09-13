const ytdl = require("ytdl-core");
const fs = require("fs");

const downloadYoutubeVideo = async (req, res) => {
  const videoUrl = req.body.videoUrl;

  const outputDir = "./downloads";

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const options = {
    quality: 'highest',
  };

  ytdl.getInfo(videoUrl, (err, info) => {
    if (err) throw err;
  
    const videoTitle = info.videoDetails.title;
    const outputFilePath = `${outputDir}/${videoTitle}.mp4`;

    console.log(videoTitle, outputFilePath)
  
    // Download the video
    const videoStream = ytdl(videoUrl, options);
  
    videoStream.pipe(fs.createWriteStream(outputFilePath));
  
    videoStream.on('end', () => {
      console.log(`Video downloaded to ${outputFilePath}`);
    });
  
    videoStream.on('error', (err) => {
      console.error('Error downloading video:', err);
    });
  });  

  res.send({ status: true, message: req.body });
};

module.exports = { downloadYoutubeVideo };
