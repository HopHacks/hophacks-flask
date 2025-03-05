const styles = {
  container: {
    marginTop: '40px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '40px'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap'
  },
  statCard: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '10px'
  },
  number: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#ff5722'
  },
  label: {
    fontSize: '20px',
    fontWeight: 'normal',
    color: '#333'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  activeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ff5722',
    color: 'white',
    cursor: 'pointer'
  },
  carousel: {
    display: 'flex',
    overflowX: 'scroll',
    gap: '16px',
    padding: '10px',
    cursor: 'grab',
    scrollbarWidth: 'none'
  },
  imageContainer: {
    position: 'relative',
    flex: '0 0 auto',
    width: '400px',
    height: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
};

export default styles;
