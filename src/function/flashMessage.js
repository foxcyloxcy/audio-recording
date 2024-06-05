export function showFlashMessage(message) {

    const notification = document.createElement("div");
    notification.className = "flash-message";
  
    const textContainer = document.createElement("div");
    textContainer.textContent = message;
  
    notification.style.position = "fixed";
    notification.style.left = "calc(97% - 470px)";
    notification.style.top = "20px";
    notification.style.padding = "10px";
    notification.style.backgroundColor = "#0a58ca";
    notification.style.color = "#FFFFFF";
    notification.style.fontFamily = "Open Sans";
    notification.style.fontSize = "17px";
    notification.style.borderRadius = "20px";
    notification.style.height = "60px";
    notification.style.width = "498px";
    notification.style.textAlign = "center";
    notification.style.boxShadow = "0 2px 10px -4px #000000";
  
    notification.style.display = "flex";
    notification.style.alignItems = "center";
    notification.style.justifyContent = "center";
  
    textContainer.style.textAlign = "left";
    textContainer.style.width = "100%";
  
    notification.appendChild(textContainer);
  
    document.body.appendChild(notification);
  
    // Swaying Animation
    notification.animate(
      [
        { transform: "translateX(calc(250% - 470px))" },
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(10px)" },
        { transform: "translateX(0)" },
      ],
      {
        duration: 2700, // Swaying animation duration
        easing: "ease-in-out",
      }
    );
  
    // Stay visible for 2 seconds
    setTimeout(() => {
      // Fast fade-out animation
      notification.style.transition = "opacity 0.3s";
      notification.style.opacity = "0";
      // Remove the element after it fades out
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
