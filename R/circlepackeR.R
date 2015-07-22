#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
circlepackeR <- function(data,
                         width = NULL, height = NULL) {

  # accept JSON string
  data = jsonlite::toJSON(
    jsonlite::fromJSON( data )
    , auto_unbox = TRUE
    , dataframe = "rows"
  )

  # create a list that contains the data
  x = list(
    data = data
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'circlepackeR',
    x,
    width = width,
    height = height,
    package = 'circlepackeR'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
circlepackeROutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'circlepackeR', width, height, package = 'circlepackeR')
}

#' Widget render function for use in Shiny
#'
#' @export
renderCirclepackeR <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, circlepackeROutput, env, quoted = TRUE)
}
