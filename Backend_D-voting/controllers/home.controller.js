const home = async (req, res) => {
  try {
    return res.send("<h1>D-voting </h1>"); 
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { home };
