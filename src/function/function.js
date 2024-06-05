export const flashMessage = (flash, accent_color, text_color, message) => {
  console.log("test", flash, accent_color, text_color, message);
    flash.show({
        html: `<div style="background-color: ${accent_color}; width:100%;">
          <p style="margin-left:1rem;color: ${text_color};">${message}</p>
        </div>`,
        clickable: true,
        blockClass:'popup-message',
        
    }); 
}