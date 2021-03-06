import {Component, Input, SimpleChanges }from '@angular/core'; 
import {Playlist, Song}from '../Model/playlist'; 
import {PlaylistService }from '../Services/playlist.service'; 
import { DataService} from '../Services/data.service';

@Component( {
    selector:'add-song-modal', 
    templateUrl:'app/Components/add_song.component.html', 
    styleUrls:['app/Components/add_song.component.css'], 
    providers:[PlaylistService]
})
export class AddSongComponent {
    public AddSongModalIsVisible:boolean; 
    keyword:string; 
    selectedResult:Song;
    searchResults:Array < Song >  = []; 
    playlists:Array < Playlist >  = [];
    insertPlaylist: Playlist; 
    selectedPlaylist: Playlist;
    private date;
    finalArtist:string;
    finalSongName:string;
    searchType:string;

    constructor (private playlistService:PlaylistService , private dataService: DataService) {
        this.dataService.selectedPlaylist$.subscribe(
            currentPlaylist => {this.selectedPlaylist = currentPlaylist;});
    }

    searchYoutube(){
        this.searchType="youtube";
        this.getSearchResults(); 
    }
    searchSoundCloud(){
        this.searchType="soundcloud";
        this.getSearchResults(); 
    }

    onSelect(song:Song) {
       this.selectedResult = song;
       if (this.selectedResult.title.includes("-")) {
       this.selectedResult.song_artist = this.selectedResult.title.substring(0, this.selectedResult.title.indexOf('-')).trim(); 
       this.selectedResult.song_name = this.selectedResult.title.substring(this.selectedResult.title.indexOf('-') + 1).trim(); 
       }
       else {
        this.selectedResult.song_artist = this.selectedResult.title.substring(0, this.selectedResult.title.indexOf(':')).trim(); 
        this.selectedResult.song_name = this.selectedResult.title.substring(this.selectedResult.title.indexOf(':') + 1).trim(); 
       }
    }

    showAddSongModal(keyword:string) {
        this.keyword = keyword; 
        this.getPlaylists(); 
        this.AddSongModalIsVisible = true;
        this.searchType = "youtube";
        this.searchYoutube();
    }

    hideAddSongModal() {
        this.AddSongModalIsVisible = false; 
        this.selectedResult = undefined;
    }
    getSearchResults() {
        if (this.searchType == 'youtube'){
        this.playlistService.getYoutubeSearchResults(this.keyword).subscribe(
            searchResults =>  {this.searchResults = searchResults; })}
        if (this.searchType == 'soundcloud'){
        this.playlistService.getSoundCloudSearchResults(this.keyword).subscribe(
            searchResults =>  {this.searchResults = searchResults; })
        }
    }
    getPlaylists() {
          this.playlistService.getPlaylists().subscribe(playlists =>  {
          this.playlists = playlists;
          if (this.selectedPlaylist != undefined){
            for (var i = 0; i < this.playlists.length; i++) {
                if (this.playlists[i].playlist_id == this.selectedPlaylist.playlist_id ){
                    this.insertPlaylist = this.playlists[i];
                }
            }
          }
          else{
              this.insertPlaylist = this.playlists[0];
              this.selectedPlaylist = this.playlists[0];
          }
        });
    }
    resetFields(){
                this.selectedResult = undefined;
                this.finalArtist = undefined;
                this.finalSongName = undefined;
    }
    insertSong(event) {
        event.preventDefault();
        if (this.finalArtist != undefined){
        this.selectedResult.song_artist = this.finalArtist;}
        if (this.finalSongName != undefined){
        this.selectedResult.song_name = this.finalSongName;}

        this.playlistService.addSong(this.selectedResult, this.insertPlaylist.playlist_id).then(
            res => {
                if (this.insertPlaylist.playlist_id == this.selectedPlaylist.playlist_id){
                this.date = new Date();
                this.selectedResult.song_added = this.date;
                this.selectedPlaylist.songs.push(this.selectedResult);
                this.dataService.announceSelectedPlaylist(this.selectedPlaylist);
                this.dataService.announceSuccess("Song " + this.selectedResult.song_artist + " - " + this.selectedResult.song_name + " added");
                this.resetFields();
                }
                else{
                this.dataService.announceSuccess("Song " + this.selectedResult.song_artist + " - " + this.selectedResult.song_name + " added");
                this.resetFields();
                }
            }, error => {this.dataService.announceError("Failed to add song. Try again!"); this.resetFields();}
        );
    }
    playlistSelect(playlist) {
        this.insertPlaylist = playlist; 
    }
}