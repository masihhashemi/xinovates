import './VideoSection.css'

function VideoSection() {
  const baseUrl = import.meta.env.BASE_URL
  
  return (
    <section className="video-section section">
      <div className="container">
        <div className="video-content">
          <h2>See Xinovates in 40 seconds</h2>
          <p className="video-description">
            A quick look at how Xinovates supports the innovation process—from problem framing to decision-making.
          </p>
          
          <div className="video-wrapper">
            <video
              className="video-player"
              controls
              preload="metadata"
              poster={`${baseUrl}assets/images/video-poster.svg`}
              aria-label="Xinovates overview video"
            >
              <source src={`${baseUrl}assets/videos/xinovate-videography.mp4`} type="video/mp4" />
              <p>
                Your browser doesn't support HTML5 video.{' '}
                <a href={`${baseUrl}assets/videos/xinovate-videography.mp4`}>Download the video</a> instead.
              </p>
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoSection

