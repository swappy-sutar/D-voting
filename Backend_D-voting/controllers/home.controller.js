const home = async (req, res) => {
  try {
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>D-Voting Backend</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          h1 {
            font-size: 3rem;
            color: #4CAF50; /* Green color */
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
          }
          .container {
            text-align: center;
            padding: 20px;
            border: 2px solid #4CAF50; /* Green border */
            border-radius: 10px;
            background-color: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Wel-come to D-Voting Backend</h1>
        </div>
      </body>
      </html>
    `;

    return res.send(htmlResponse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { home };
