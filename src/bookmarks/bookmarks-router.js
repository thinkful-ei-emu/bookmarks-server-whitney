const express = require('express');
const uuid = require('uuid/v4');

const bookmarks = require('../store');
const logger = require('../logger');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    console.log('I am getting here');
    const { title, url, desc, rating} = req.body;
  
    if(!title) {
      logger.error('Title is required');
      return res  
        .status(400)
        .send('Invalid data');
    }
  
    if(!url) {
      logger.error('Url is required');
      return res
        .status(400)
        .send('Invalid data');
    }
  
    if(!desc) {
      logger.error('Description is required');
      return res
        .status(400)
        .send('Invalid data');
    }
  
    if(!rating) {
      logger.error('Rating is required');
      return res
        .status(400)
        .send('Invalid data');
    }
  
    //get an id
    const id = uuid();
  
    const bookmark = {
      id,
      title,
      url,
      desc,
      rating
    };
  
    bookmarks.push(bookmark);
  
    logger.info(`Bookmark with id ${id} created`);
  
    res
      .status(201)
      .location(`http://localhost:8000/:user/bookmark/${id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id === id);
  
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark not found');
    }
    res.json(bookmark);
  })
  .patch(bodyParser, (req, res) => {
    const { title, url, desc, rating } = req.body;
    const {id} = req.params;
  
    const bookmark = bookmarks.find(bookmark => bookmark.id === id);
  
    if(title) {
      bookmark.title = title;
    } else
    if(url) {
      bookmark.url = url;
    } else
    if (desc) {
      bookmark.desc = desc;
    } else
    if (rating) {
      bookmark.rating = rating;
    }
  
    logger.info(`Bookmark with id ${id} was updated`);
  
    res
      .status(200)
      .location(`http://localhost8000/:user/bookmark/${id}`)
      .json(bookmark);
  
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === id);
    
    if (bookmarkIndex === -1) {
      logger.error(`List with id ${id} not found`);
      return res
        .status(404)
        .send('Not found');
    }
    
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`List with id ${id} deleted.`);
  
    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter;