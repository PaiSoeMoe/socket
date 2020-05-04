import { Component, OnInit } from '@angular/core';
import { Socket } from "ngx-socket-io";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  accounts = [];
  title = 'chat-front';
  id;
  friendsOnline;
  txt = "";
  to;
  name = "";
  joined = false;
  constructor(private socket: Socket) {
  }

  ngOnInit() {

    this.socket.on('socketID', (m) => {
      this.id = m;
    })

    this.socket.on('list', (ms) => {

      if (ms.length > 0) {
        let ii = ms.find(u => {
          return u.name === this.id.id;
        });
        let users = ms.filter(f => { return f !== ii })
        this.friendsOnline = users.map(f => {
          return { id: f, messages: [], newMs: false }

        })
        console.log(this.friendsOnline);
      }
    })

    this.socket.on("message", (m) => {
      console.log("message", m);
      let account = this.friendsOnline.find(f => f.id.id === m.id);
      console.log(account);
      account.messages = account.messages.concat({ id: account.id, timestamp: Date.now(), message: m.message });
      account.newMs = true;
    })

  }

  join() {
    this.socket.emit('register', this.name);
    this.joined = true;
    console.log(this.joined);
  }

  send() {
    let account = this.friendsOnline.find(f => f.id === this.to.id);
    console.log("i am id ", this.id);
    account.messages = account.messages.concat({ id: { name: this.id.id }, timestamp: Date.now(), message: this.txt })
    this.socket.emit("message", { to: this.to.id, message: this.txt })
  }

  select(f) {
    this.to = f;
  }

  check(f) {
    f.newMs = false;
  }

}
