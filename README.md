## Say it Forward

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
'Say it Forward' is a browser based web application to help mobile phone users who want to contribute to a positive movement combat and counteract daily negativity by performing random acts of kindness virtually via their devices.

This is Josh and I am excited

Lucas is not excited for the merge conflicts :(

Hi there, my name is Kelly and I like Christmas

## Technologies

Technologies used for this project:

* HTML, CSS
* JavaScript
* Bootstrap
* Firebase, Firestore

## Content

Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
└── README.md

It has the following sub folders and files:
├── .git                     # Folder for git repo
├── helpers                  # Folder for helpers
    /createEmojiData.js      # Creates data for each emoji
    /write-compliments.js    # Adds compliment data to firebase

├── html                     # Folder for html
    /browse.html             # Browse page containing all compliments
    /compliment-details.html # Details page for the compliment
    /inbox.html              # A page containing all compliments the user has received
    /main.html               # Homepage containing the quote og the day and a button to send a new compliment
    /message-details.html    # Details page for the compliments that were sent to the user in the inbox
    /profile.html            # Contains information about the user, contains functionality to change the information fields
    /setting.html            # Contains an option for the user to set a preferred compliment
    /sif-browse.html         # a separate browse page exclusive for the 'pay it forward' part of the app
    /sif-compliment-details.html # a separate compliment details page exclusive for the 'pay it forward' part of the app

├── images                   # Folder for images
    /logo.png                

├── scripts                  # Folder for scripts
    /authentication.js       # Checks if the user is a current user or if they are new. 
    /browse.js               # JS for browse.html
    /compliment-details.js   # JS for compliment-details.html
    /firebaseAPI_COMP1800_DTC01.js # firebase API stuff, shared across all pages
    /inbox.js                #  JS for inbox.html
    /main.js                 # Homepage containing the quote of the day, and a button to send a new compliment
    /message-details.js      # JS for message-details.html
    /profile.js              # JS for profile.html
    /script.js               # Check if the user has any new messages. If they do, display notification badge on inbox icon.
    /settings.js             # JS for settings.html
    /sif-browse.js           # JS for sif-browse.html
    /sif-compliment-details.js # JS for sif-compliment-details.html
    /skeleton.js             # Contains functionality for navbar placeholders

├── styles                   # Folder for styles
    /style.css               # Style for every html file

├── templates                # Folder for templates
    /footer-empty.html       # Empty footer, applied on index.html and login.html
    /footer.html             # Footer, shared across pages
    /nav-back-btn.html       # Top nav with no back button, applied on pages that don't require a back button
    /nav-no-account-icon.html# Top nav with no account icon, applied on index.html and login.html
    /nav.html                # Top nav bar complete with a logo, company name, and a profile icon that serves as a dropdown menu.

Firebase hosting files: 
├── .firebaserc...


```

Tips for file naming files and folders:

* use lowercase with no spaces
* use dashes (not underscore) for word separation
