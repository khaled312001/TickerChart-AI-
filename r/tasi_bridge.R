#!/usr/bin/env Rscript
suppressWarnings(suppressMessages({
  if (!requireNamespace("jsonlite", quietly = TRUE)) {
    install.packages("jsonlite", repos = "https://cloud.r-project.org")
  }
  library(jsonlite)
}))

write_json_safe <- function(obj) {
  cat(jsonlite::toJSON(obj, auto_unbox = TRUE, pretty = TRUE, na = "null"))
}

# ensure tasi is installed
ensure_tasi <- function() {
  if (!requireNamespace("tasi", quietly = TRUE)) {
    if (!requireNamespace("remotes", quietly = TRUE)) install.packages("remotes", repos = "https://cloud.r-project.org")
    tryCatch({
      remotes::install_github("Hussain-Alsalman/tasi", upgrade = "never", quiet = TRUE)
    }, error = function(e) {
      write_json_safe(list(success = FALSE, error = paste("Failed to install tasi:", e$message)))
      quit(status = 0)
    })
  }
  suppressMessages(library(tasi))
}

args <- commandArgs(trailingOnly = TRUE)
action <- if (length(args) >= 1) args[[1]] else "tasi_data"

safe_main <- function() {
  ensure_tasi()
  if (action == "tasi_data") {
    period <- if (length(args) >= 2) args[[2]] else "1mo"
    # Map simple period to dates (approximate)
    days <- switch(period, `1d` = 1, `5d` = 5, `1mo` = 30, `3mo` = 90, `1y` = 365, 30)
    end <- Sys.Date()
    start <- end - days
    df <- tryCatch({
      tasi::get_index_records(as.character(start), as.character(end))
    }, error = function(e) NULL)
    if (is.null(df) || nrow(df) == 0) {
      write_json_safe(list(success = FALSE, error = "No TASI data"))
      return(invisible(NULL))
    }
    out <- list(
      success = TRUE,
      data = lapply(seq_len(nrow(df)), function(i) {
        list(
          date = as.character(df$transactionDate[i]),
          open = as.numeric(df$openPrice[i]),
          high = as.numeric(df$highPrice[i]),
          low = as.numeric(df$lowPrice[i]),
          close = as.numeric(df$previousClosePrice[i]),
          volume = as.numeric(df$volume[i])
        )
      })
    )
    write_json_safe(out)
  } else if (action == "company_data") {
    symbol <- args[[2]]
    start <- args[[3]]
    end <- args[[4]]
    df <- tryCatch({
      tasi::get_company_records(start, end, company_symbol = as.integer(symbol))
    }, error = function(e) NULL)
    if (is.null(df) || nrow(df) == 0) {
      write_json_safe(list(success = FALSE, error = "No company data"))
      return(invisible(NULL))
    }
    out <- list(
      success = TRUE,
      data = lapply(seq_len(nrow(df)), function(i) {
        list(
          date = as.character(df$transactionDate[i]),
          open = as.numeric(df$openPrice[i]),
          high = as.numeric(df$highPrice[i]),
          low = as.numeric(df$lowPrice[i]),
          close = as.numeric(df$previousClosePrice[i]),
          volume = as.numeric(df$volume[i])
        )
      })
    )
    write_json_safe(out)
  } else if (action == "market_data") {
    # Example: fetch a small list of key symbols and return latest row
    syms <- c(1120, 2010, 7010, 1180, 2222)
    end <- Sys.Date()
    start <- end - 5
    lst <- list()
    for (s in syms) {
      df <- tryCatch({
        tasi::get_company_records(as.character(start), as.character(end), company_symbol = s)
      }, error = function(e) NULL)
      if (!is.null(df) && nrow(df) > 0) {
        last <- df[nrow(df), ]
        name <- as.character(s)
        lst[[name]] <- list(
          price = as.numeric(last$previousClosePrice),
          change = as.numeric(last$previousClosePrice - last$openPrice),
          changePercent = as.numeric(100 * (last$previousClosePrice - last$openPrice) / last$openPrice),
          volume = as.numeric(last$volume),
          high = as.numeric(last$highPrice),
          low = as.numeric(last$lowPrice)
        )
      }
    }
    write_json_safe(list(success = TRUE, data = lst))
  } else if (action == "indicators") {
    # Derive indicators from index and a few proxies
    end <- Sys.Date(); start <- end - 5
    idx <- tryCatch({
      tasi::get_index_records(as.character(start), as.character(end))
    }, error = function(e) NULL)
    if (is.null(idx) || nrow(idx) == 0) {
      write_json_safe(list(success = FALSE, error = "No indicators"))
      return(invisible(NULL))
    }
    last <- idx[nrow(idx), ]
    tadawul <- list(
      value = as.numeric(last$previousClosePrice),
      change = as.numeric(last$previousClosePrice - last$openPrice),
      changePercent = as.numeric(100 * (last$previousClosePrice - last$openPrice) / last$openPrice)
    )
    write_json_safe(list(success = TRUE, data = list(tadawul = tadawul)))
  } else if (action == "income_statement") {
    company <- args[[2]]
    periodType <- if (length(args) >= 3) args[[3]] else "q"
    df <- tryCatch({
      tasi::get_income_statement(as.integer(company), period_type = periodType)
    }, error = function(e) NULL)
    if (is.null(df)) {
      write_json_safe(list(success = FALSE, error = "No income statement"))
      return(invisible(NULL))
    }
    write_json_safe(list(success = TRUE, data = df))
  } else {
    write_json_safe(list(success = FALSE, error = "Invalid action"))
  }
}

tryCatch({ safe_main() }, error = function(e) {
  write_json_safe(list(success = FALSE, error = e$message))
}) 