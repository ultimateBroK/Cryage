# cryage_backend/app/core/logging_conf.py

import logging
import json
import sys
from typing import Dict, Any

# Custom JSON formatter for structured logging
class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_record: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Include exception info if exists
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)

        # Add any custom fields from extra param
        for key, value in record.__dict__.items():
            if key not in ["args", "asctime", "created", "exc_info", "exc_text",
                          "filename", "funcName", "id", "levelname", "levelno",
                          "lineno", "module", "msecs", "message", "msg", "name",
                          "pathname", "process", "processName", "relativeCreated",
                          "stack_info", "thread", "threadName"]:
                log_record[key] = value

        return json.dumps(log_record)


# Configure handlers
def setup_logging() -> None:
    # Get root logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Clear any existing handlers
    if logger.handlers:
        for handler in logger.handlers:
            logger.removeHandler(handler)

    # Configure stdout handler with JSON formatting
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    logger.addHandler(handler)

    # Set logging level for third-party libraries
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("asyncio").setLevel(logging.WARNING)

    # Log startup message
    logger.info("Logging initialized for cryage_backend")


# Get a logger instance for a specific component
def get_logger(component: str) -> logging.Logger:
    return logging.getLogger(component)
