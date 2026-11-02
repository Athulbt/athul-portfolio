import type { Project } from "./types";

// Code highlights are trimmed excerpts from the real repositories on github.com/Athulbt.
export const projects: Project[] = [
  {
    id: "lambton-window-pros",
    title: "Lambton Window Pros",
    tagline: "Booking platform for a local business",
    emoji: "🪟",
    logo: "/logos/company/lambton-window-pros.png",
    category: "Client",
    description:
      "The company's official website, with online appointment booking, a role-based admin dashboard and automated email notifications. Online bookings went up 30% after launch.",
    stack: ["react", "nodejs", "express", "docker", "githubactions"],
    liveUrl: "https://www.lambtonwindowpros.ca",
    privateNote: "Client code is private",
    architecture: [
      "React SPA talks to an Express REST API",
      "Role-based access control guards the admin routes",
      "Booking events trigger automated email notifications",
      "Docker Compose environments, CI/CD tests every push before release",
    ],
    featured: true,
  },
  {
    id: "banking",
    title: "MERN Banking Platform",
    tagline: "Accounts, transfers and history behind JWT auth",
    emoji: "🏦",
    category: "Full Stack",
    description:
      "A full stack banking app with registration and login, multiple account types, domestic and international transfers with fees and exchange rates, and a filterable transaction history.",
    stack: ["react", "vitejs", "tailwindcss", "nodejs", "express", "mongodb", "jwt"],
    repo: "BankingApp",
    architecture: [
      "Vite + React front end with protected routes and an AuthContext",
      "Express routers split by resource: auth, users, accounts, transactions",
      "Mongoose models for User, Account and Transaction",
      "express-validator on every write, auth middleware verifies the JWT",
    ],
    highlight: {
      file: "backend/routes/transactions.js",
      language: "javascript",
      code: `const calculateFee = (type, amount, isInternational = false) => {
  if (isInternational) {
    return Math.min(amount * 0.03, 25);   // 3%, capped at $25
  }
  const fees = { transfer: 0, deposit: 0, withdrawal: 2.5, payment: 1.5 };
  return fees[type] || 0;
};

router.post('/', [
  auth,
  body('fromAccount').isMongoId(),
  body('amount').isFloat({ min: 0.01 }),
  body('type').isIn(['transfer', 'deposit', 'withdrawal', 'payment', 'international'])
], async (req, res) => {
  // Only move money out of an account the signed-in user owns
  const sourceAccount = await Account.findOne({ _id: fromAccount, user: req.user.id });
  if (sourceAccount.balance < amount + fee) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }
  ...`,
      notes: [
        "Validation runs as middleware before the handler, so bad input never reaches the database.",
        "Ownership is enforced in the query itself (user: req.user.id), not trusted from the client.",
        "Fees are a pure function, which keeps the pricing rules easy to test.",
      ],
    },
  },
  {
    id: "movie-manager",
    title: "MovieManager",
    tagline: "ASP.NET Core MVC with JWT and MongoDB Atlas",
    emoji: "🎬",
    category: "Full Stack",
    description:
      "A C# web app for managing a movie catalogue: list, search, add, edit and delete movies, with user registration, login and profiles.",
    stack: ["csharp", "dotnetcore", "mongodb", "bootstrap", "jwt"],
    repo: "MovieManager",
    architecture: [
      "Classic MVC: Controllers → Services → Models, rendered with Razor views",
      "MovieService and UserService wrap the MongoDB driver, injected via DI",
      "JwtService issues HMAC-SHA256 tokens that expire after one hour",
      "Structured logging with ILogger on every controller action",
    ],
    highlight: {
      file: "Controllers/MoviesController.cs",
      language: "csharp",
      code: `public class MoviesController : Controller
{
    private readonly MovieService _service;
    private readonly ILogger<MoviesController> _logger;

    public MoviesController(MovieService service, ILogger<MoviesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(Movie movie)
    {
        if (!ModelState.IsValid)
            return View("Create", movie);

        _service.Create(movie);
        TempData["SuccessMessage"] = $"Movie '{movie.Title}' has been added successfully!";
        return RedirectToAction("index");
    }
}`,
      notes: [
        "Dependencies come in through the constructor, so the controller stays thin and testable.",
        "[ValidateAntiForgeryToken] protects every form POST against CSRF.",
        "Post/Redirect/Get with TempData avoids duplicate submissions on refresh.",
      ],
    },
  },
  {
    id: "traffic-sign",
    title: "Traffic Sign Detection",
    tagline: "YOLOv3 on a Raspberry Pi, with spoken alerts",
    emoji: "🚦",
    category: "AI / ML",
    description:
      "Real-time traffic sign detection that runs on a Raspberry Pi 4 and announces signs through a Bluetooth speaker. I built and labelled the dataset myself from 500+ photos.",
    stack: ["python", "opencv", "tensorflow", "keras", "raspberrypi"],
    repo: "TrafficSign",
    architecture: [
      "Pi Camera frames → OpenCV preprocessing → YOLOv3 detection",
      "Custom-trained weights on a hand-collected dataset of 500+ images",
      "Each detected class maps to a pre-generated text-to-speech clip",
    ],
    highlight: {
      file: "detect.py",
      language: "python",
      code: `net = cv2.dnn.readNet('yolov3_training_last.weights', 'yolov3_testing.cfg')

while True:
    _, img = cap.read()
    blob = cv2.dnn.blobFromImage(img, 1/255, (416, 416), (0, 0, 0), swapRB=False, crop=False)
    net.setInput(blob)
    layerOutputs = net.forward(net.getUnconnectedOutLayersNames())

    for output in layerOutputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            if scores[class_id] > 0.2:
                # (simplified: the original maps each class with an if/elif chain)
                playsound(ALERTS[class_id])   # "Stop", "School ahead", ...`,
      notes: [
        "Runs YOLOv3 through OpenCV's DNN module, so no heavy deep learning runtime is needed on the Pi.",
        "Frames are normalised to 416×416 blobs, which is the input size YOLOv3 was trained on.",
        "Spoken alerts are generated ahead of time with gTTS to keep the detection loop fast.",
      ],
    },
  },
  {
    id: "comment-analysis",
    title: "Comment Analysis",
    tagline: "Multilingual sentiment analysis with Gemini",
    emoji: "💬",
    category: "AI / ML",
    description:
      "Paste a comment in any language and get back Positive, Negative or Neutral with a short explanation. Built for feedback portals and customer support.",
    stack: ["javascript", "html5", "css3"],
    repo: "CommentAnalysis",
    architecture: [
      "Browser-only app that calls the Gemini generateContent API",
      "System prompt and JSON response schema force structured output",
      "Exponential backoff retries handle rate limits (HTTP 429)",
    ],
    highlight: {
      file: "script.js",
      language: "javascript",
      code: `const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options);
    if (response.status === 429 && retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithBackoff(url, options, retries - 1, delay * 2);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithBackoff(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};`,
      notes: [
        "Retries double the wait each time (1s → 2s → 4s), the standard way to back off from rate limits.",
        "Network errors and 429s are both retried, while other errors surface straight to the UI.",
        "The model must reply with { sentiment, reasoning } JSON, so parsing never guesses.",
      ],
    },
  },
  {
    id: "rc-motor",
    title: "Xbox-Controlled RC Car",
    tagline: "Raspberry Pi robot with camera data logging",
    emoji: "🏎️",
    category: "Hardware",
    description:
      "A Raspberry Pi RC car driven with an Xbox controller. It steers with a servo, drives a DC motor through a DROK controller, and logs every input with camera frames to build a self-driving dataset.",
    stack: ["python", "opencv", "raspberrypi"],
    repo: "RCMotor",
    architecture: [
      "approxeng.input reads the Xbox controller over Bluetooth",
      "50 Hz PWM drives the steering servo; GPIO pins switch the motor direction",
      "Each input is timestamped and paired with a camera frame for training data",
    ],
    highlight: {
      file: "rc.py",
      language: "python",
      code: `GPIO.setmode(GPIO.BCM)

control = 17                       # servo control pin
GPIO.setup(control, GPIO.OUT)
servo = GPIO.PWM(control, 50)      # 50 Hz PWM signal for the servo
servo.start(0)

in1, in2, enA = 24, 25, 23         # DROK motor controller pins
def setup():
    GPIO.setup(in1, GPIO.OUT)
    GPIO.setup(in2, GPIO.OUT)
    GPIO.setup(enA, GPIO.OUT)`,
      notes: [
        "Hobby servos expect a 50 Hz signal, and the duty cycle sets the steering angle.",
        "Two direction pins plus an enable pin give forward, reverse and stop.",
        "Logging inputs alongside frames turns every drive into labelled training data.",
      ],
    },
  },
  {
    id: "bookstore",
    title: "Bookstore Platform",
    tagline: "Team build with a full CI/CD pipeline",
    emoji: "📚",
    category: "Full Stack",
    description:
      "An Agile team project: a bookstore web app with RESTful book routes and a SQL-seeded database, containerized with Docker and tested on every push.",
    stack: ["nodejs", "express", "mysql", "docker", "githubactions", "jest"],
    privateNote: "Team repo is private",
    architecture: [
      "Express REST routes for books backed by a seeded relational database",
      "GitHub Actions runs Jest unit tests and ESLint on every push",
      "Pull-request workflow with code review across 26+ commits",
    ],
  },
];

// Smaller repos listed under "More on GitHub".
export const otherRepos = [
  { name: "Crud-app", note: "Express + Pug + MongoDB user registration CRUD" },
  { name: "Devor", note: "Multi-page brand website" },
  { name: "JumpBoyGame", note: "2D platformer in Unity (C#)" },
];
