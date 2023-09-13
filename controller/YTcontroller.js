const ytdl = require("ytdl-core");
const fs = require("fs");

const downloadYoutubeVideo = async (req, res) => {
  const videoUrl = req.body.videoUrl;
  const outputDir = "./downloads";

  try {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const options = {
      quality: 'highest',
    };

    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoTitle = videoInfo.videoDetails.title;
    const outputFilePath = `${outputDir}/${videoTitle}.mp4`;

    console.log(videoTitle, outputFilePath);

    const videoStream = ytdl(videoUrl, options);
    videoStream.pipe(fs.createWriteStream(outputFilePath));

    videoStream.on('end', () => {
      console.log(`Video downloaded to ${outputFilePath}`);
      res.status(200).json({ status: true, message: 'Video downloaded successfully' });
    });

    videoStream.on('error', (err) => {
      console.error('Error downloading video:', err);
      res.status(500).json({ status: false, message: 'Error downloading video' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = { downloadYoutubeVideo };
