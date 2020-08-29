const errorHandler = (err, req, res, next) => {
  if (err.status === 404) res.status(404).render("Errors/404");
  else {
    console.log(err);
    res.status(500).render("Errors/500");
  }
};

module.exports = errorHandler;
