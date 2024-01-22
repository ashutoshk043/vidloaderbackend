const ytdl = require("ytdl-core");
const fs = require("fs");


const getVideoDetails = async (req, res) => {
  try {
    const videoUrl = req.body.videoUrl;
    const newUrl = new URL(videoUrl);
    const { host } = newUrl;

    switch (host) {
      case 'www.youtube.com':
        try {
          const videoQualities = []
          const info = await ytdl.getInfo(videoUrl);
  
          // Video details
          const videoTitle = info.videoDetails.title
          const videoAuthor = info.videoDetails.author.name
          const videoDuration = info.videoDetails.lengthSeconds + ' seconds'
          const currVideoUrl = info.videoDetails.video_url
          const videoThumbnail = info.videoDetails.thumbnails[0].url;
          const videoFormats = info.formats;
  
          // console.log(videoFormats, "videoFormats")
  
          for(let format of videoFormats){
            if(!videoQualities.includes(format.qualityLabel) && format.qualityLabel != null){
              videoQualities.push({qualityLabel:format.qualityLabel, quality:format.itag})
            }
          }
  
          videoQualities.sort()
  
          const data = {
            "videoTitle":videoTitle,
            "videoAuthor":videoAuthor,
            "videoDuration":videoDuration,
            "currVideoUrl":currVideoUrl,
            "videoThumbnail":videoThumbnail,
            "videoFormats":videoQualities
          }
  
          res.send({status:true, data:data})
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ status: false, message: err.message });
        }

        break;
      default:
        // Handle other hosts if needed
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};



const downloadYoutubeVideo = async (req, res) => {
  const videoUrl = req.body.videoUrl;
  const currVideoQuality = req.body.quality

  try {
    // Ensure the output directory exists

    const newUrl = new URL(videoUrl) 
    const {host} = newUrl

    switch(host){

      case 'www.youtube.com':
        try {
          if (!fs.existsSync("./youtube")) {
            fs.mkdirSync("./youtube");
          }
      
          const options = {
            quality: currVideoQuality,
          };
      
          const videoInfo = await ytdl.getInfo(videoUrl);
          const videoTitle = videoInfo.videoDetails.title+new Date();
          const outputFilePath = `${"./youtube"}/${videoTitle}.mp4`;
      
          // console.log(videoTitle, outputFilePath);
      
          const videoStream = ytdl(videoUrl, options);
          videoStream.pipe(fs.createWriteStream(outputFilePath));
      
          videoStream.on('end', () => {
            console.log(`Video downloaded to ${outputFilePath}`);
            res.status(200).json({ status: true, message: 'Video downloaded successfully' });
          });
      
          videoStream.on('error', (err) => {
            console.error('Error downloading video:', err);
            res.status(500).json({ status: false, message: err.message });
          });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ status: false, message: err.message });
        }
        break;
      default:
    }

    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = { downloadYoutubeVideo , getVideoDetails};
