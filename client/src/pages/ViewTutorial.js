import { React, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

//import Learnify components
import { ViewLesson } from '../components';

//Material-UI imports
import clsx from 'clsx';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore, SkipPrevious, SkipNext } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';

//database-related imports
import { useQuery } from '@apollo/client';
import { GET_TUTORIAL } from '../utils/queries/tutorialQueries';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: '3%',
  },
  button: {
    background: '#f7d148',
    '&:hover': { background: '#f2bf07'}
  },
  chip: {
    marginLeft: 8,
    marginRight: 8,
    ...theme.typography.button,
    backgroundColor: '#92b4d4',
    fontWeight: 'bold',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export function ViewTutorial() {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  //function to handle click on expand icon and update State
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //get ID from URL and get associated {tutorial} from db
  const { tutorialId } = useParams();
  const { loading, err, data } = useQuery(GET_TUTORIAL, {
    variables: { tutorialId: tutorialId },
  });
  console.log(loading, err, data);
  if (loading) {
    return <p>Loading your tutorial...</p>;
  }
  if (err) {
    return <p>Error loading your tutorial</p>;
  }

  const tutorial = data?.tutorial;
  if (!tutorial) {
    return <p>Tutorial not found</p>;
  }
  //destructure fields from tutorial object
  const { teacher } = tutorial;
  const username = teacher?.[0]?.username;
  const overview = tutorial.overview;
  const { categories } = tutorial;
  const duration = tutorial.totalDuration;
  const { lessons } = tutorial;
  const { reviews } = tutorial;

  //map categories array for use on/around 180
  function categoryList(categories) {
    return (
      <>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.category}
            className={classes.chip}
          />
        ))}
      </>
    );
  }

  //map lessons array for use on/around line 196
  function lessonList(lessons) {
    return (
      <>
        {lessons.map((lesson) => (
          <Link
            to={`/lesson/${lesson.id}`}
            key={lesson._id}
          >
            <p>{lesson.name}</p>
          </Link>
        ))}
      </>
    );
  }

  //map reviews array for use on/around line 226
  function reviewList(reviews) {
    return (
      <>
        {reviews.map((review) => (
          <Card
            key={review.id}
            style={{ backgroundColor: '#dae9f7', margin: 2 }}
          >
            <Rating
              name='read-only'
              value={review.rating}
              readOnly
            />
            <p>{review.comment}</p>
          </Card>
        ))}
      </>
    );
  }

  //calculate average rating
  let totalRating = 0;
  for (const review of reviews) {
    totalRating += review.rating;
  }
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  console.log(averageRating);

  return (
    <div className='root'>
      <Container>
        <Typography
          variant='h4'
          style={{
            color: '#283845',
            fontWeight: 'bold',
            margin: '2%',
          }}
        >
          {tutorial?.title}
        </Typography>
        <Grid
          container
          justifyContent='space-around'
          className='title'
        >
          <Grid
            item
            xs={3}
          >
            <Typography variant='h6'>Instructor: {username}</Typography>
          </Grid>
          <Divider
            orientation='vertical'
            flexItem
          />
          <Grid
            item
            xs={3}
          >
            <Typography variant='h6'>
              Time to complete: {duration} minutes
            </Typography>
          </Grid>
          <Divider
            orientation='vertical'
            flexItem
          />
          <Grid
            item
            xs={3}
          >
            <Rating
              name='read-only'
              value={averageRating}
              readOnly
            />
            <Typography variant='subtitle1'>
              {reviews.length} Ratings
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent='center'
          spacing={2}
          style={{
            color: '#283845',
            margin: '2%',
          }}
        >
          {/* TODO: ADD SCROLL BAR FOR REVIEWS */}
          <Grid
            item
            xs={10}
            direction='row'
          >
            <Typography variant='body1'>{overview}</Typography>
          </Grid>
          <Grid
            item
            xs={10}
            direction='row'
          >
            {categoryList(categories)}
          </Grid>
        </Grid>
      </Container>
      <Divider variant='middle' />
      <Container>
        <Grid
          container
          direction='row'
          justifyContent='space-evenly'
          alignItems='center'
          style={{
            color: '#283845',
            margin: '2%',
          }}
        >
          <Grid
            item
            xs={10}
            md={5}
          >
            <Card
              style={{
                backgroundColor: '#dae9f7',
                border: '1rem solid #92b4d4',
              }}
            >
              <CardMedia
                component='img'
                image={tutorial.thumbnail}
                title='Media image provided by user'
              />
              <CardContent>
                <Typography
                  variant='h5'
                  component='h2'
                >
                  Lessons
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label='show more'
                  >
                    <ExpandMore />
                  </IconButton>
                </Typography>
                <Collapse
                  in={expanded}
                  timeout='auto'
                  unmountOnExit
                >
                  <CardContent>{lessonList(lessons)}</CardContent>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={10}
            md={5}
          >
            <Card
              style={{
                backgroundColor: '#92b4d4',
                margin: '5%',
                paddingTop: '3%',
              }}
            >
              <Typography
                variant='h5'
                component='h2'
              >
                Reviews
              </Typography>

              <Card
                style={{ backgroundColor: '#92b4d4', margin: 3, padding: 3 }}
              >
                {reviewList(reviews)}
              </Card>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid
          container
          direction='row'
          justifyContent='space-around'
          style={{
            color: '#283845',
            margin: '2%',
          }}
        >
          <Grid item>
            <Button
              variant='contained'
              className={classes.button}
              startIcon={<SkipPrevious fontSize='large' />}
              >Previous Lesson</Button>
          </Grid>
          <Grid item>
            <ViewLesson />
          </Grid>
          <Grid item>
          <Button
              variant='contained'
              className={classes.button}
              endIcon={<SkipNext fontSize='large' />}
              >Next Lesson</Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default ViewTutorial;
