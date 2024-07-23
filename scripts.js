"use strict";

// Clicking header toggles visibility of menu
document.querySelectorAll("header > h1").forEach((elem) =>
  elem.addEventListener("click", () => {
    $("#menu").slideToggle();
  })
);

// Automatically hide menu on mobile
const hideMenuOnMobile = () => {
  if (window.innerWidth < 640) {
    $("#menu").slideUp();
  } else {
    $("#menu").slideDown();
  }
};
document.addEventListener("DOMContentLoaded", hideMenuOnMobile);
window.addEventListener("resize", () => {
  hideMenuOnMobile();
});

//Helper function to close nav dropdowns
const closeNavDropdowns = () => {
  $("#menu ul li ul").slideUp();
  document
    .querySelectorAll("#menu ul li.current")
    .forEach((menu) => menu.classList.remove("current"));
};

//Toggle submenus on click
const initMenus = () => {
  document.querySelectorAll("#menu ul li > a").forEach((elem) => {
    if (
      [...elem.closest("li").children].filter(
        (child) => child.tagName.toLowerCase() == "ul"
      ).length !== 0
    ) {
      elem.setAttribute("title", "Expand submenu");
      elem.classList.add("submenu");
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        [...elem.closest("li").children]
          .filter((child) => child.tagName.toLowerCase() == "ul")
          .forEach((child) => {
            $(child).slideToggle();
          });
        elem.closest("li").classList.toggle("current");
        document.querySelector("body").addEventListener("click", (e) => {
          if (!e.target.classList.contains("submenu")) {
            closeNavDropdowns();
          }
        });
        return false;
      });
      elem.classList.add("toggleable");
    }
  });
};
document.addEventListener("DOMContentLoaded", initMenus);

//Show parent breadcrumbs' submnavs on hover
const initSubnavsOnHover = () => {
  let lastSubnav = document.querySelector("#menu > a:last-of-type + ul");
  document
    .querySelectorAll("#menu > a:not(:last-of-type)")
    .forEach((breadcrumb) => {
      let nextSibling = breadcrumb.nextElementSibling;
      if (nextSibling.tagName.toLowerCase() == "ul") {
        let thisSubnav = nextSibling;
        breadcrumb.addEventListener("mouseenter", (e) => {
          if (e.relatedTarget != thisSubnav) {
            let subnavs = document.querySelectorAll(
              "#menu > a:not(:last-of-type) + *"
            );
            $(subnavs).clearQueue().stop().hide(0);
            $(lastSubnav).clearQueue().stop().show(0);
          }
          $(lastSubnav).slideUp();
          $(thisSubnav).slideDown({
            start: () => {
              thisSubnav.style.display = "flex";
            },
          });
        });
        let hideSubnavFromHover = () => {
          $(thisSubnav).slideUp();
          $(lastSubnav).slideDown();
          closeNavDropdowns();
        };
        breadcrumb.addEventListener("mouseleave", (e) => {
          if (e.relatedTarget != thisSubnav) {
            hideSubnavFromHover();
          }
        });
        nextSibling.addEventListener("mouseleave", (e) => {
          if (e.relatedTarget != breadcrumb) {
            hideSubnavFromHover();
          }
        });
      }
    });
};
document.addEventListener("DOMContentLoaded", initSubnavsOnHover);

//Toggle sections by clicking their headers
const initToggleSections = () => {
  document
    .querySelectorAll(
      "section > h2, section > h3, section > h4, section > h5, section > h6"
    )
    .forEach((elem) => {
      elem.style.cursor = "pointer";
      elem.setAttribute("title", "Collapse section");
      elem.closest("section").classList.add("toggleable");
      elem.addEventListener("click", () => {
        toggleSection(elem);
      });
    });
};
document.addEventListener("DOMContentLoaded", initToggleSections);

//Toggle all sections (except or only anchor)
const initToggleAllSections = () => {
  if (document.querySelector("main > section")) {
    let toggleAllControls = document.createElement("div");
    toggleAllControls.classList.add("toggleAllControls");
    toggleAllControls.innerHTML = `
    <a class="expandAll" onClick="expandAll()">Expand All</a>
    <a class="expandAnchor" onClick="expandAnchor()">Expand Section</a>
    <a href="${location.hash}" class="anchorTarget">${location.hash}</a>
    <a class="collapseOthers" onClick="collapseOthers()">Collapse Others</a>
    <a class="collapseAll" onClick="collapseAll()">Collapse All</a>
  `.trim();
    document.querySelector("main").prepend(toggleAllControls.cloneNode(true));
    document.querySelector("main").append(toggleAllControls.cloneNode(true));
  }
};
document.addEventListener("DOMContentLoaded", initToggleAllSections);

//Enable or disable buttons only relevant when there's a hash
const toggleAbleOfHashOnlyToggleButtons = () => {
  if (location.hash) {
    document.querySelectorAll(".collapseOthers").forEach((el) => {
      el.classList.remove("disabled");
    });
    document.querySelectorAll(".expandAnchor").forEach((el) => {
      el.classList.remove("disabled");
    });
    document.querySelectorAll(".anchorTarget").forEach((el) => {
      el.classList.remove("disabled");
    });
    document.querySelectorAll(".anchorTarget").forEach((el) => {
      el.textContent = document
        .querySelector(location.hash)
        .querySelector("h2, h3, h4, h5, h6").textContent;
    });
  } else {
    document.querySelectorAll(".collapseOthers").forEach((el) => {
      el.classList.add("disabled");
    });
    document.querySelectorAll(".expandAnchor").forEach((el) => {
      el.classList.add("disabled");
    });
    document.querySelectorAll(".anchorTarget").forEach((el) => {
      el.classList.add("disabled");
    });
    document.querySelectorAll(".anchorTarget").forEach((el) => {
      el.textContent = " ";
    });
  }
  document.querySelectorAll(".anchorTarget").forEach((el) => {
    el.setAttribute("href", location.hash);
  });
};
document.addEventListener(
  "DOMContentLoaded",
  toggleAbleOfHashOnlyToggleButtons
);
window.addEventListener("hashchange", toggleAbleOfHashOnlyToggleButtons);

//Toggle sections by clicking their headers
const toggleSection = (elem) => {
  let thisSection = elem.closest("section");
  if (thisSection.classList.contains("collapsed")) {
    expandSection(elem);
  } else {
    collapseSection(elem);
  }
  location.hash = thisSection.id;
  thisSection.scrollIntoView(true);
};

//To collapse a section from one of its elements
const collapseSection = (elem) => {
  let thisSection = elem.closest("section");
  console.log("collapsing section", thisSection.id);
  [...thisSection.children].forEach((child) => {
    if (
      !(
        ["h2", "h3", "h4", "h5", "h6"].includes(child.tagName.toLowerCase()) ||
        child.classList.contains("description")
      )
    ) {
      $(child).fadeOut(500);
    }
  });
  thisSection.classList.add("collapsed");
  elem.setAttribute("title", "Expand section");
};

//To expand a section (and all parent sections) from one of its elements
const expandSection = (elem) => {
  let thisSection = elem.closest("section");
  console.log("expanding section", thisSection.id);
  let sections = [];
  let section = elem;
  while (section) {
    sections.unshift(section);
    section = section.parentElement;
  }
  sections
    .filter(
      (section) =>
        section.tagName.toLowerCase() == "section" &&
        section.classList.contains("toggleable")
    )
    .forEach((section) => {
      section.classList.remove("collapsed");
      [...section.children].forEach((child) => {
        if (
          ["h2", "h3", "h4", "h5", "h6"].includes(child.tagName.toLowerCase())
        ) {
          child.setAttribute("title", "Collapse section");
        } else if (!child.classList.contains("description")) {
          $(child).fadeIn(500);
        }
      });
    });
};

//Collapse all subsections (except anchor anchor and its parents)
const collapseOthers = () => {
  let anchorId = location.hash;
  let anchor;
  if (anchorId) {
    anchor = document.querySelector(anchorId);
  }
  document
    .querySelectorAll(
      "section > h2, section > h3, section > h4, section > h5, section > h6"
    )
    .forEach((heading) => {
      let thisSection = heading.closest("section");
      if (
        !anchorId ||
        (!(`#${thisSection.id}` == anchorId || thisSection.contains(anchor)) &&
          !heading.closest("section").classList.contains("collapsed"))
      ) {
        collapseSection(heading);
      }
    });
  if (anchorId) {
    setTimeout(() => {
      location.hash = anchorId.substring(1);
      anchor.scrollIntoView(true);
    }, 500);
  }
};
const collapseAll = () => {
  let oldHash = location.hash;
  location.hash = "";
  collapseOthers();
  setTimeout(() => {
    location.hash = oldHash;
  }, 500);
};

//Expand anchor and its parents (or else all subsections)
const expandAnchor = () => {
  let anchorId = location.hash;
  let anchor;
  if (anchorId) {
    anchor = document.querySelector(anchorId);
  }
  document
    .querySelectorAll(
      "section > h2, section > h3, section > h4, section > h5, section > h6"
    )
    .forEach((heading) => {
      let thisSection = heading.closest("section");
      if (
        (!anchorId ||
          `#${thisSection.id}` == anchorId ||
          thisSection.contains(anchor)) &&
        heading.closest("section").classList.contains("collapsed")
      ) {
        expandSection(heading);
      }
    });
  if (anchorId) {
    setTimeout(() => {
      location.hash = anchorId.substring(1);
      anchor.scrollIntoView(true);
    }, 500);
  }
};
const expandAll = () => {
  let oldHash = location.hash;
  location.hash = "";
  expandAnchor();
  setTimeout(() => {
    location.hash = oldHash;
  }, 500);
};

// Make external links open in new windows or tabs
const externalLinks = () => {
  document.querySelectorAll("a").forEach((link) => {
    let theHref = link.getAttribute("href");
    if (
      theHref &&
      theHref.startsWith("http") &&
      !theHref.includes(location.hostname)
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(link.href);
      });
      link.setAttribute("title", "Opens in a new window");
      link.setAttribute("rel", "External");
    }
  });
};
document.addEventListener("DOMContentLoaded", externalLinks);

// Gallery modal display functionality

//Initialize global variable of slides
var slides;

//Sets up the structure of the modal (all hidden by default) and the events listeners to open and close it
const initDisplayModal = () => {
  //Gathers all the slides into a collection
  slides = document.querySelectorAll(".gallery a[href*='/display/'] img");

  //Adds onclick event to every slide link to open modal display
  slides.forEach((element, index) => {
    element.closest("a").addEventListener("click", (e) => {
      e.preventDefault();
      currentSlide(index);
      openModal();
    });
  });

  //Gets the modal from an external file and appends it after the (last) main element
  if (slides.length !== 0) {
    //Fetch the modal
    fetch("/display/modal.html")
      .then((res) => res.text())
      .then((html) => {
        let theModal = new DOMParser()
          .parseFromString(html, "text/html")
          .getElementById("displayModal");
        //Inset it into the DOM
        document.querySelector("main").lastChild.after(theModal);
        //Add onclick to close it when clicking background
        theModal.addEventListener("click", (e) => {
          if (e.target === theModal) {
            closeModal();
          }
        });
        //Hide it
        $(theModal).hide();
      });
  }
};
document.addEventListener("DOMContentLoaded", initDisplayModal);

//Initializes the slideshow index
var slideIndex = 0;

//Steps forward through the slideshow (or backward if negative)
const plusSlides = (n) => {
  $("#modalImage").fadeOut("", function () {
    document.getElementById("modalImage").setAttribute("src", "");
    showSlides((slideIndex += n));
    $(this).fadeIn();
  });
};

//Sets the slide index as specified
const currentSlide = (n) => {
  document.getElementById("modalImage").setAttribute("src", "");
  showSlides((slideIndex = n));
};

//Populates the modal with the data of the specified slide
const showSlides = (n) => {
  var l = slides.length;
  if (n >= l) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = l - 1;
  }
  var slide = slides[slideIndex];
  var caption = document.getElementById("caption");
  var captionText = slide.closest("li").querySelector("h3").innerHTML;
  caption.innerHTML = captionText;
  var image = document.getElementById("modalImage");
  var srcstr = slide.getAttribute("src").replace(/-thumb/, "");
  image.setAttribute("src", srcstr);
  image.setAttribute("alt", captionText);
};

//Opens the modal image display
const openModal = () => {
  $("#displayModal").show();
  $("#displayModal").animate({ opacity: 1 });
  return false;
};

//Closes the modal image display
const closeModal = () => {
  $("#displayModal").animate({ opacity: 0 }, function () {
    $("#displayModal").hide();
  });
};
