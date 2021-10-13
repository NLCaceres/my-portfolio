import Alert from 'react-bootstrap/Alert'
import FloatingAlertCss from './FloatingAlert.module.css';

const UnavailableFeatureAlert = props => {
  return (
    <Alert className={`${FloatingAlertCss.floatingAlert}`} show={ props.show } 
      variant="danger" onClose={ () => props.setShow(false) } dismissible>
        <Alert.Heading>Sorry! This Feature is currently unavailable!</Alert.Heading>
        <p> Hopefully I'll have everything back up and running soon! In the mean time, enjoy the rest of my portfolio. Thanks!</p>
    </Alert>
  );
}

export default UnavailableFeatureAlert;