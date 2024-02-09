import { Injectable } from '@angular/core';
import { SupportDetails } from 'src/app/model/SupportDetails';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  constructor() {}

  instituteSupport() {
    return [
      new SupportDetails(
        'assets/Support/1.jpeg',
        'Institute Profile',
        'Step 01',
        "Let's begin by setting up the Institute profile before we begin to work on the other features."
      ),
      new SupportDetails(
        'assets/Support/2.jpeg',
        'Cover Image',
        'Step 02',
        'Click the Camera icon and choose a photo from your local drive to use as your Institute Cover Page.'
      ),
      new SupportDetails(
        'assets/Support/3.jpeg',
        'Save Image',
        'Step 03',
        'Select the right image and crop it if necessary. Save your picture and upload it to your profile page.'
      ),
      new SupportDetails(
        'assets/Support/4.jpeg',
        'Save Details',
        'Step 04',
        'After entering all the fields of the form, click the submit button to save the records.'
      ),
      new SupportDetails(
        'assets/Support/5.jpeg',
        'Details saved',
        'Step 05',
        'You have successfully configured your Institute branding in the Marketplace.'
      ),
    ];
  }

  roleSupport() {
    return [
      new SupportDetails(
        'assets/Support/6.jpeg',
        'Manage Access',
        'Step 01',
        'For each role in the LMS, click on the Action button to view or manage the access privileges assigned to that role.'
      ),
      new SupportDetails(
        'assets/Support/7.jpeg',
        'Student Role',
        'Step 02',
        'The Student Role is limited to accessing the Dashboard and the Courses available through the LMS.'
      ),
      new SupportDetails(
        'assets/Support/8.jpeg',
        'Teacher Role',
        'Step 03',
        'A Teacher role is a role that gives you access to any screen that has a checkbox for that role. You can create new roles or modify existing roles to grant or deny specific privileges.'
      ),
      new SupportDetails(
        'assets/Support/9.jpeg',
        'Institute Admin Role',
        'Step 04',
        'The Institute Admin Role has all of the privileges of the entire LMS.'
      ),
    ];
  }

  userSupport() {
    return [
      new SupportDetails(
        'assets/Support/10.jpeg',
        'Manage Users',
        'Step 01',
        "Let's create Users and then assign them to the Roles we just managed."
      ),
      new SupportDetails(
        'assets/Support/11.jpeg',
        'Users Listing',
        'Step 02',
        'When you first log in to the system, you will not see any entries for administrators, teachers, or students.'
      ),
      new SupportDetails(
        'assets/Support/12.jpeg',
        'Offline Enrollment',
        'Step 03',
        'To manage offline enrolments click the tab Offline Enrolments.'
      ),
      new SupportDetails(
        'assets/Support/13.jpeg',
        'Bulk User Upload',
        'Step 04',
        'Use this option when uploading many Users at the same time, in the LMS.'
      ),
      new SupportDetails(
        'assets/Support/16.jpeg',
        'Create User',
        'Step 05',
        'Let us create your 1st Teacher and a Student in the Learning Management System.'
      ),
      new SupportDetails(
        'assets/Support/26.jpeg',
        'Enable Teacher',
        'Step 06',
        'To make a Teacher record visible in the Marketplace, click the Teachers tab and then click Enabled.'
      ),
      new SupportDetails(
        'assets/Support/27.jpeg',
        'Feature Teacher',
        'Step 07',
        'For a teacher to be listed in the Marketplace and be able to accept students, he or she must be made public and features enabled.'
      ),
      new SupportDetails(
        'assets/Support/28.jpeg',
        'Enable Student',
        'Step 08',
        'By default, students are created with access options set to Disabled. Enable the option to give them access to the features of the LMS.'
      ),
    ];
  }

  bulkUploadSupport() {
    return [
      new SupportDetails(
        'assets/Support/14.jpeg',
        'Sample Sheet',
        'Step 01',
        'You can download a spreadsheet template for bulk uploads and fill in the details yourself.'
      ),
      new SupportDetails(
        'assets/Support/15.jpeg',
        'Upload Sheet',
        'Step 02',
        'Check to see that the spreadsheet has no errors, and then select the file for bulk upload.'
      ),
    ];
  }

  addUserSupport() {
    return [
      new SupportDetails(
        'assets/Support/17.jpeg',
        'Add Details',
        'Step 01',
        'Please enter your name, gender and email address. A valid email address is required to receive updates and notifications throughout the course.'
      ),
      new SupportDetails(
        'assets/Support/18.jpeg',
        'Submit Details',
        'Step 02',
        'Enter the role you would like the user to have and click Submit to save the record.'
      ),
      new SupportDetails(
        'assets/Support/19.jpeg',
        'Map To Batch',
        'Step 03',
        'When you create a Teacher or Student for the 1st time, you will be asked to Map the User to the desired Course/Class Batches.'
      ),
      new SupportDetails(
        'assets/Support/20.jpeg',
        'Batch Mapping',
        'Step 04',
        'You will not see any Courses and Batches information when you create your LMS for the 1st time.'
      ),
      new SupportDetails(
        'assets/Support/21.jpeg',
        'Close Batch Mapping',
        'Step 05',
        'Click Close and continue to map the Batches later.'
      ),
      new SupportDetails(
        'assets/Support/23.jpeg',
        'Add Student',
        'Step 06',
        'In order to create a user account for a learner in an LMS, you must enter all the fields.'
      ),
      new SupportDetails(
        'assets/Support/24.jpeg',
        'Submit details',
        'Step 07',
        'Click "Submit" to save your record.'
      ),
      new SupportDetails(
        'assets/Support/25.jpeg',
        'Map to Batch or Cancel',
        'Step 08',
        'You can click Map To Batch to view & manage the Batches for the User. Or you can also click Cancel to continue creating more Users.'
      ),
    ];
  }

  courseListingSupport() {
    return [
      new SupportDetails(
        'assets/Support/30.jpeg',
        'Manage Course',
        'Step 01',
        "When you click on Manage Courses, you'll be able see all of the courses that have been created and marked as LIVE. If they have been disabled, post - duration or suspended for any reason then it will show up here as well."
      ),
      new SupportDetails(
        'assets/Support/31.jpeg',
        'Course Listing',
        'Step 02',
        'They are empty because it is the first time you have logged in, and the system will ask for all of the information that it needs from new users like yourself.'
      ),
      new SupportDetails(
        'assets/Support/32.jpeg',
        'Add New Course',
        'Step 03',
        "Start by clicking on Add New Course and we'll take care of everything else."
      ),
    ];
  }

  courseCreationSupport() {
    return [
      new SupportDetails(
        'assets/Support/33.jpeg',
        'Course Details',
        'Step 01',
        "When you create a course, it's easy to forget about the thumbnail image that displays for students. make sure your image conveys what message or idea wants people to take away from it when they see it on screen."
      ),
      new SupportDetails(
        'assets/Support/34.jpeg',
        'Course Syllabus',
        'Step 02',
        "This is a great opportunity to share your knowledge and skills with students who are looking forward taking their studies further. They will get a taste of what's out there, as well."
      ),
      new SupportDetails(
        'assets/Support/35.jpeg',
        'Optimize Search',
        'Step 03',
        "You should use at least two different keywords in your course content for optimal search engine optimization and indexing effectiveness, but don't worry - we'll give you some help."
      ),
      new SupportDetails(
        'assets/Support/36.jpeg',
        'Map with Categories',
        'Step 04',
        "Now that you've completed the most basic steps, it's time to define the categories and subcategories for your course. Select from the drop - down options to define what value should be associated with each one and map them accordingly in order for everything to make sense."
      ),
      new SupportDetails(
        'assets/Support/37.jpeg',
        'Map with Sub Categories',
        'Step 05',
        'It is important to map out all the Sub Categories for your courses so they are clear and easy to understand.'
      ),
      new SupportDetails(
        'assets/Support/38.jpeg',
        'Demo Video Necessity',
        'Step 06',
        'You should also add a demo video so that when students come browsing for courses, they will see the one about yours. If not, the LMS will play one from their database which might not be relevant at all so make sure there are some Moving Images about what we offer here today.'
      ),
      new SupportDetails(
        'assets/Support/39.jpeg',
        'Course Offers',
        'Step 07',
        "If you intend to Add some Study Materials, Tasks (Assignments), or Quiz to your courses, just click the YES option wherever it's appropriate in order for this feature to work properly on your site."
      ),
      new SupportDetails(
        'assets/Support/40.jpeg',
        'Course Submission Check',
        'Step 08',
        'Make sure each of your entries is correct and complete before you submit it.'
      ),
      new SupportDetails(
        'assets/Support/41.jpeg',
        'Submit Course Details',
        'Step 09',
        'Click Submit and Next to save the record.'
      ),
      new SupportDetails(
        'assets/Support/42.jpeg',
        'Important details to pay attention to',
        'Step 10',
        "When you see a Warning, the LMS needs few mandatory values. If you miss those, a message will show in your notification center explaining why and what needs to happen next - but it won't stop you from continuing with the course."
      ),
      new SupportDetails(
        'assets/Support/43.jpeg',
        'Pricing Plan Details',
        'Step 11',
        "Great job, you seem like an expert already and you want to sell these courses?Yeah, of course otherwise there would be no reason for us both being on this marketplace right? Well then let's put some pricing together - what say 200 - 300 for each package?"
      ),
      new SupportDetails(
        'assets/Support/44.jpeg',
        'Submit Pricing Plan',
        'Step 12',
        'After creating your first one, it will be easier to map them all together so they make sense for customers who want to buy courses online.'
      ),
      new SupportDetails(
        'assets/Support/45.jpeg',
        'Submit Pricing Plan',
        'Step 13',
        'After creating your first one, it will be easier to map them all together so they make sense for customers who want to buy courses online.'
      ),
      new SupportDetails(
        'assets/Support/45.jpeg',
        'Proceed Further',
        'Step 14',
        'Click "OK"'
      ),
      new SupportDetails(
        'assets/Support/46.jpeg',
        'Edit Pricing Plan',
        'Step 15',
        'If you wish to make any edits for the record, click the Sandwich menu bar at right to edit. Proceed directly into batch for further action.'
      ),
      new SupportDetails(
        'assets/Support/47.jpeg',
        'Continue to Batch',
        'Step 16',
        'Why are you waiting for now?The time has come to assign this course to a batch and class, making them available for your scheduled classes.'
      ),
      new SupportDetails(
        'assets/Support/48.jpeg',
        'Add Batch',
        'Step 17',
        'The Batch to Live/Online Class function allows you to group together all of your current offline students into one location for easy access when creating new classes online.'
      ),
      new SupportDetails(
        'assets/Support/49.jpeg',
        'Batch Details',
        'Step 18',
        'Define the Start and End Dates for your batch, and assign the pricing plan that you had created earlier. You can have upto the maximum numbers you defined for this class. So be mindful of how many people will be in your course at any given time.'
      ),
      new SupportDetails(
        'assets/Support/50.jpeg',
        'Add Teacher',
        'Step 19',
        'When you Add a Teacher, by default the user will be your available one. Click the Add New option at the top of the screen to create a new one quickly and easily.'
      ),
      new SupportDetails(
        'assets/Support/51.jpeg',
        'Fill teacher details',
        'Step 20',
        "When you create a new teacher through the Add Teacher menu, make sure that the Phone Numbers and Email ID's are correct. These are the key elements when that teacher logs in and becomes active on our system."
      ),
      new SupportDetails(
        'assets/Support/52.jpeg',
        'Submit teacher details',
        'Step 21',
        'Now that you have created a Teacher, you are all set to go forward.'
      ),
      new SupportDetails(
        'assets/Support/53.jpeg',
        'Map teacher to the batch',
        'Step 22',
        'Assign the Teacher who will Teach your Course - class batch.'
      ),
      new SupportDetails(
        'assets/Support/54.jpeg',
        'Submit and proceed further',
        'Step 23',
        "Now you're all set to make your course live on the LMS platform. Don't forget to create the Class Schedule in the next step."
      ),
    ];
  }

  classCreationSupport() {
    return [
      new SupportDetails(
        'assets/Support/55.jpeg',
        'Create Class',
        'Step 01',
        "You can't run a class without a class schedule, so make sure you create one now."
      ),
      new SupportDetails(
        'assets/Support/56.jpeg',
        'Add Class Schedule Details',
        'Step 02',
        "The class could be a Regular continous session or 1 off webinar kind of thing and it could also Demo for people who want test out new skills before investing into them fully or buying into them entirely - there aren't any strings attached just yet though."
      ),
      new SupportDetails(
        'assets/Support/57.jpeg',
        'Search made simple',
        'Step 03',
        'You can use the keywords in your tags to help find what it is that you want from the course.'
      ),
      new SupportDetails(
        'assets/Support/58.jpeg',
        'Fill necessary details',
        'Step 04',
        "When you're ready to sell your course, we want to make sure that the information is easy for students to understand. So just fill these sections out and their parents will know exactly what they are getting into."
      ),
      new SupportDetails(
        'assets/Support/59.jpeg',
        'Repeat Classes',
        'Step 05',
        'You can also use the repeat online class to have the number of days over a week, or the number of times this class will be LIVE.'
      ),
      new SupportDetails(
        'assets/Support/60.jpeg',
        'Configure accordingly',
        'Step 06',
        'When scheduling an online class with an end date, make sure you remember that it will be scheduled only till that date and it will show up as completed courses after that. Students can only view recorded sessions after their end date has passed.'
      ),
      new SupportDetails(
        'assets/Support/61.jpeg',
        'Submit Class Schedule Details',
        'Step 07',
        'It will automatically calculate the end date for you, so all you need do is choose the number of classes and your program will be complete soon enough.'
      ),
    ];
  }
}
