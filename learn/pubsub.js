var publisher = {
  publish: function(pubsub) {
    pubsub.publish();
  }
}

var pubsub = {
  subscribes: [],
  publish: function() {
    this.subscribes.forEach((sub) => {
      sub.update();
    })
  },
  subscribe: function(sub) {
    this.subscribes.push(sub);
  }
}

var subscribe = {
  update: function() {
    console.log('update');
  },
  subscribe: function(pubsub) {
    pubsub.subscribe(this);
  }
}

subscribe.subscribe(pubsub);
publisher.publish(pubsub);