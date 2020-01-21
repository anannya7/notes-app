import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { FilterPipe} from '../filter.pipe'; //filter pipe to search data in the list
declare var $:any;


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  current_date;
  note_id:number = 0;
  note_list:any = [];
  selected_id: number;
  show_text_area:boolean = false
  sidebar:boolean = true
  selected_note: number;
  mainText;
  additionalText;
  searchText:string;

  constructor(private changeDetection: ChangeDetectorRef,private elementRef: ElementRef
    ) { }

  ngOnInit() {
  }

  // method for adding new note
  sendValue(event){
    this.current_date = moment(new Date()).format('MMMM Do YYYY , h:mm a'); 
    var found = this.note_list.find((a) => a.id === this.selected_id)
    var index = this.note_list.indexOf(found); 
    if(event.target.value == ''){ //check if input data is blank set default text
      this.note_list[index]['text'] = 'New Note';
    }
    else{
       this.note_list[index]['text'] = event.target.value;
    }
    this.note_list[index]['time_stamp'] = moment(new Date()).format('h:mm a');
    this.changeDetection.detectChanges(); // for detect the changes and reflect in view
  }
  
  // method for creating an object for a new note
  createNote(){
    this.show_text_area = true
    this.note_id =  this.note_id + 1
    var obj = {
      'id':  this.note_id,
      'text':'New Note',
      'additional_text':'No additional text',
      'time_stamp':moment(new Date()).format('h:mm a')
    }
    this.note_list.push(obj);
    this.note_list.sort((a, b) => a.id - b.id).reverse();
    this.selected_id = this.note_id;
    this.selected_note = this.note_id;  //make recently added note as selected
    this.selectNote(this.note_id);
    localStorage.setItem('notes',this.note_list)
    
  }
  // method to toggle sidebar on click of toggle button
  toggleSidebar(){
    this.sidebar = !this.sidebar
    var elem = document.getElementById('content');
    if(!this.sidebar){   
      elem.style.width = 100 + "%";
    }
    else{
      elem.style.width = "calc(100% - 250px)";
    }

  }
  // trigger event while entering additional text
  sendAdditionalValue(event){
    this.current_date = moment(new Date()).format('MMMM Do YYYY , h:mm a'); 
    var found = this.note_list.find((a) => a.id === this.selected_id)
    var index = this.note_list.indexOf(found);
    if(event.target.value == ''){ //check if input data is blank set default text
      this.note_list[index]['additional_text'] = 'No additional text';
    }
    else{
       this.note_list[index]['additional_text'] = event.target.value;
    }    this.note_list[index]['time_stamp'] = moment(new Date()).format('h:mm a');
    this.changeDetection.detectChanges();
  }
  // move the cursor to the next line on enter press
  processKeyUp(e, el) {
    if(e.keyCode == 13) { // press Enter
      el.focus();
    }
  }
  // method to set which not has been selected
  selectNote(id:number){
    this.selected_note = id;
    this.selected_id = id;
    var found = this.note_list.find((a) => a.id === this.selected_id)
    var index = this.note_list.indexOf(found); 
    for(let obj of this.note_list){
      if(obj.id === this.selected_id){
        if(obj['text'] != 'New Note' && obj['additional_text'] != 'No additional text'){
            this.mainText = obj['text'];
            this.additionalText = obj['additional_text'];
        }
        else if(obj['text'] == 'New Note' && obj['additional_text'] == 'No additional text'){
            this.mainText = '';
            this.additionalText = '';
        }else if(obj['text'] != 'New Note' && obj['additional_text'] == 'No additional text'){
            this.mainText = obj['text'];
            this.additionalText ='';
        }
        else{
          this.mainText = '';
            this.additionalText = obj['additional_text'];
        }
      }
    }
  }
  // method to delete created note
  deleteNote(){
    this.note_list = this.note_list.filter(i => i.id !== this.selected_note);
    this.selected_note = this.note_list[0].id //set the last added note as active
  }
 
}
