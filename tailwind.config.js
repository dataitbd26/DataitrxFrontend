/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  
        'sporty-blue': '#147bff',
        'casual-black': '#181818',
        'concrete': '#F2f2f2',
        
 
        'earls-green': '#ccc141',
        'fascinating-magenta': '#cd3c84',
        'psychedelic-violet': '#a04fff',
        'blue-green': '#00bda9',
      },
      fontFamily: {
   
        primary: ['Poppins', 'sans-serif'],
        secondary: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
   
        'headline': ['96pt', { fontWeight: '900' }],   
        'subheader': ['64pt', { fontWeight: '600' }],  
        'body': ['20pt', { fontWeight: '400' }],      
        'btn-text': ['24pt', { fontWeight: '600' }],   
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    theme: "mytheme", 
    darkTheme: "mytheme", 

    themes: [
      {
        mytheme: {
          "primary": "#147bff",     
          "secondary": "#a04fff",    
          "accent": "#00bda9",       
          "neutral": "#181818",    
          "base-100": "#f2f2f2",      
          "base-content": "#181818",  
          "info": "#147bff",          
          "success": "#ccc141",       
          "warning": "#cd3c84",       
          "error": "#cd3c84",         
        },
      },
      "light",
      "dark"
    ],
  },
};