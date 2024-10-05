**Newsly – Personalized Newsletter Service**

**Overview**

Newsly is a personalized newsletter broadcast service that allows users to subscribe to various topics of interest. This project automates the creation and delivery of newsletters based on user subscriptions. It leverages AWS services such as Simple Notification Service (SNS), Simple Queue Service (SQS), Simple Storage Service (S3), and EventBridge to provide a reliable, scalable, and automated newsletter distribution pipeline.

**Features**

**User-Subscribed Topics**: Users can subscribe to specific topics of interest via SNS, ensuring they receive relevant newsletters.

**Newsletter Storage**: Newsletters are stored in S3 buckets, each bucket corresponding to a specific SNS topic.

**Automated Broadcast Pipeline**:
Scheduled broadcasts pull messages from an SQS queue.
EventBridge triggers the automated sending of newsletters to subscribers at specified intervals.
Scalable Architecture: Built to handle a large number of topics, subscribers, and messages using AWS services.

**AWS Services Used**

**Amazon SNS**: Used for managing user subscriptions and broadcasting newsletters to specific topic subscribers.

**Amazon S3**: Stores the newsletter content that is linked to the appropriate SNS topics.

**Amazon SQS**: Acts as a backlog for storing the messages that need to be broadcast.

**Amazon EventBridge**: Schedules and triggers newsletter broadcasts at set intervals.
Architecture

**User Subscription**: Users subscribe to various topics using SNS, which links them to the corresponding S3 buckets storing newsletter content.

**Newsletter Storage**: Newsletters for each topic are uploaded and stored in S3.

**Message Backlog**: The content of newsletters is pushed into an SQS queue, acting as a backlog for upcoming broadcasts.

**Automated Scheduling**: EventBridge is configured to pull messages from the SQS queue at regular intervals and broadcast them to the appropriate SNS topic subscribers.

**Usage**

**Subscribing to a Topic:**
Users can subscribe to newsletters by providing their email addresses and selecting the topics of interest.
Each selected topic corresponds to an SNS topic.

**Sending Newsletters:**
Newsletters are automatically pushed from the SQS queue and broadcast to subscribers at regular intervals using EventBridge.
