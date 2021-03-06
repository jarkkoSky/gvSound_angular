import { Component, Input, ViewChild } from '@angular/core';
import { AddSongComponent } from '../Components/add_song.component';
import { DataService } from '../Services/data.service';
import { User } from '../Model/user';

@Component({
    selector: 'navigation-component',
  templateUrl: 'app/Components/navigation.component.html',
  styleUrls: ['app/Components/navigation.component.css'],
})
export class NavigationComponent {
      componentName:'NavigationComponent';
      @ViewChild(AddSongComponent) addSong: AddSongComponent;
      keyword = '';
      username:string;
      password:string;
      buttonText = '';
      user: User;
      result: String;
      showLogIn: boolean;
      registerValue: boolean;

      constructor(private dataService: DataService ){
        this.dataService.user$.subscribe(
        user =>  { if (localStorage.getItem("token") != "dGVzdA==" ) {
                  this.buttonText = "Log Out";
                  this.showLogIn = false;
                  user = this.user;
                  }
                  else{
                  this.buttonText = "Log In";
                  this.showLogIn = true;
                  user = this.user;
                  }
        });
        this.dataService.register$.subscribe(
          register => {this.registerValue = register;}
        );

      }
      showAddSongModal(){
        if (this.keyword == undefined || this.keyword == ""){

        }
        else{
        this.addSong.showAddSongModal(this.keyword);
        }
      }

      ngOnInit(){
        this.user = new User();

        if (localStorage.getItem("token") != "dGVzdA=="){
            this.buttonText = "Log Out";
            this.showLogIn = false;
            this.user.username = localStorage.getItem("username");
        }
        else{
          this.buttonText = "Log In";
          this.showLogIn = true;
        }
      }

      logIn(event){
        event.preventDefault();

        if (localStorage.getItem("token") != "dGVzdA=="){
          this.showLogIn = true;
          this.user.username = "test";
          this.user.password = "test";
          this.dataService.authUser(this.user);
        }
        else
        {
          if (this.username == "" || this.username == undefined || this.password == "" || this.password == undefined){
          return; 
          }
          this.user.username = this.username;
          this.user.password = this.password;
          this.dataService.authUser(this.user);
          this.username = "";
          this.password = "";
        }
      }
      register(event){
        event.preventDefault();

        if (this.registerValue == true){
          this.dataService.announceRegister(false);
        }
        else{
          this.dataService.announceRegister(true);
        }
      }
}