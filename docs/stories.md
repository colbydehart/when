#Add Calendar
###As a `User`
###In order to `See when friends are available`
###I want to `Create a new event`
##Acceptable Criteria:
- Event must have a name > 3 characters
- Event must have a length (selection of all day or not. Stretch
  goals would be to set variable hours and multi-day events)
- After a user creates a calendar, they are taken to the 
  show page, where they can edit their availability/timeframe of event.
  timeframes can be up to 35 days, stretch goal would be to make multi 
  month events
- After they save their availability, a link is created and shown in a modal
  so that they can share with friends. stretch goal would be to make a 
  list of emails, and automatically email each participant, then email user
  after they all update their availability.

#Edit a Calendar
###As a `Guest/User`
###In order to `Share my availability`
###I want to `Update another user's event`
##Acceptable Criteria:
- A Calendar will be displayed with all days greyed out, the user can
  click and drag to highlight available days. Rows and columns can be 
  clicked to select an entire day or week. For non-all day events, the
  days will be split into morning, afternoon, evening, and night. If a 
  user has been here before, their settings will be pulled from 
  localStorage
- The user or guest must enter a name or the form will not submit.
- The user or guest must enter a valid email or the form will not submit
- If they select nothing, the button to submit will say "Cannot attend"
- After filling out their availability, the button will change to say 
  "Submit avalability"

#View results
###As a `User`
###In order to `Plan an event`
###I want to `See the results of everyone's availability`
##Acceptable Criteria:
- Will show a mini-calendar in the right with dates highlighted that are
  good for everyone.
- Will show a list of dates that are good with everyone with a mailto link 
  for everyone who filled out the calendar. If there was no good day for 
  everyone, it will show days where the most people could attend with the
  names of possible groups of people.
- After the mailto link is clicked, a prompt will come up, asking the user 
  if they are done with the calendar and want to delete it.
