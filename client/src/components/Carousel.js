import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
  carousel: {
    textAlign: 'center',
    margin: theme.spacing(2, 0),
  },
  carouselContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '400px',
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: `2px solid ${theme.palette.type === 'dark' ? 'white' : 'black'}`,
  },
  cardImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
  },
  carouselArrows: {
    margin: theme.spacing(2),
  },
  arrowButton: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1),
    color: theme.palette.type === 'dark' ? 'white' : 'black',
  },
}));

const Carousel = () => {
  const classes = useStyles();
  const theme = useTheme();

  const items = [
    {
      title: 'Item 1',
      description: 'Description for Item 1',
      image: 'item1.jpg',
    },
    {
      title: 'Item 2',
      description: 'Description for Item 2',
      image: 'item2.jpg',
    },
    {
      title: 'Item 3',
      description: 'Description for Item 3',
      image: 'item3.jpg',
    },
    {
      title: 'Item 4',
      description: 'Description for Item 4',
      image: 'item4.jpg',
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [items.length]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === 0) {
        return items.length - 1;
      } else {
        return prevIndex - 1;
      }
    });
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div className={classes.carousel}>
      <h2>Carousel Component</h2>
      <div className={classes.carouselContent}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            style={{
              display: index === activeIndex ? 'block' : 'none',
            }}
          >
            <Card className={classes.card}>
              <img src={item.image} alt={item.title} className={classes.cardImage} />
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body1" component="p">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className={classes.carouselArrows}>
        <IconButton
          className={classes.arrowButton}
          color="primary"
          onClick={handlePrev}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          className={classes.arrowButton}
          color="primary"
          onClick={handleNext}
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Carousel;
