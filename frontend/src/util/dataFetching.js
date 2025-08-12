const dataFetching = async (url, options = {}) => {
    try {
      // 1. Await the fetch call to get the raw response
      const response = await fetch(url, options);
  
      // 2. Check if the response was successful (status in the 200-299 range)
      console.log('Response status:', response.json());
      if (!response.ok) {
        // If not, throw an error that will be caught by the catch block
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // 3. Await the parsing of the JSON body
      const data = await response.json();
      
      // 4. Return the parsed data
      return data;
      
    } catch (error) {
      // This single block will catch any error from the try block
      console.error('Error during data fetching:', error);
      
      // Re-throwing the error is good practice if you want the calling function
      // to know that the request failed.
      throw error;
    }
  };

  export default dataFetching;