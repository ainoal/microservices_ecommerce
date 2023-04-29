const publish = (() => {
  const events = {};

  function publish(event, data) {
    if (!events[event]) {
      return false;
    }

    const subscribers = events[event];
    subscribers.forEach((subscriber) => {
      subscriber.func(event, data);
    });
    return true;
  }

  return {
    publish
  };
})();