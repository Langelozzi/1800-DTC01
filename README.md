## Say it Forward

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
'Say it Forward' is a browser based web application to help mobile phone users who want to contribute to a positive movement combat and counteract daily negativity by performing random acts of kindness virtually via their devices.

## Technologies

Technologies used for this project:

* HTML, CSS
* JavaScript
* Jquery
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
├── .git                     # folder for git repo
├── helpers                  # folder for helpers
    /createEmojiData.js      # creates data for each emoji
    /write-compliments.js    # adds compliment data to firebase

├── html                     # folder for html
    /browse.html             # browse page containing all compliments
    /compliment-details.html # details page for the compliment
    /inbox.html              # a page containing all compliments the user has received
    /main.html               # homepage containing the quote og the day and a button to send a new compliment
    /message-details.html    # details page for the compliments that were sent to the user in the inbox
    /profile.html            # contains information about the user, contains functionality to change the information fields
    /setting.html            # contains an option for the user to set a preferred compliment
    /sif-browse.html         # a separate browse page exclusive for the 'pay it forward' part of the app
    /sif-compliment-details.html # a separate compliment details page exclusive for the 'pay it forward' part of the app

├── images                   # folder for images
    /logo.png                

├── scripts                  # folder for scripts
    /authentication.js       # checks if the user is a current user or if they are new. 
    /browse.js               # JS for browse.html
    /compliment-details.js   # JS for compliment-details.html
    /firebaseAPI_COMP1800_DTC01.js # firebase API stuff, shared across all pages
    /inbox.js                #  JS for inbox.html
    /main.js                 # homepage containing the quote of the day, and a button to send a new compliment
    /message-details.js      # JS for message-details.html
    /profile.js              # JS for profile.html
    /script.js               # check if the user has any new messages. If they do, display notification badge on inbox icon.
    /settings.js             # JS for settings.html
    /sif-browse.js           # JS for sif-browse.html
    /sif-compliment-details.js # JS for sif-compliment-details.html
    /skeleton.js             # contains functionality for navbar placeholders

├── styles                   # folder for styles
    /style.css               # style for every html file

├── templates                # folder for templates
    /footer-empty.html       # empty footer, applied on index.html and login.html
    /footer.html             # footer, shared across pages
    /nav-back-btn.html       # top nav with no back button, applied on pages that don't require a back button
    /nav-no-account-icon.html# top nav with no account icon, applied on index.html and login.html
    /nav.html                # top nav bar complete with a logo, company name, and a profile icon that serves as a dropdown menu.

Firebase hosting files: 
├── .firebaserc...
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules
├── .firebase
    /hosting..cache



```

Tips for file naming files and folders:

* use lowercase with no spaces
* use dashes (not underscore) for word separation
