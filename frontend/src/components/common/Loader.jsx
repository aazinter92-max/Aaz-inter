import './Loader.css';

const Loader = ({ fullScreen = false, size = 'medium', text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className="loader-spinner"></div>
        <p className="loader-text">{text}</p>
      </div>
    );
  }

  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
