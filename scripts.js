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

//Initialize toggling sections by clicking their headers
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

//Toggle sections by clicking their headers
const toggleSection = (elem) => {
  let thisSection = elem.closest("section");
  if (thisSection.classList.contains("collapsed")) {
    expandSection(elem);
  } else {
    collapseSection(elem);
  }
  location.hash = thisSection.id;
};

//Collapse a section from one of its elements
const collapseSection = (elem) => {
  let thisSection = elem.closest("section");
  // console.log("collapsing section", thisSection.id);
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
  toggleToggleButtons();
};

//Expand a section (and all parent sections) from one of its elements
const expandSection = (elem) => {
  let thisSection = elem.closest("section");
  // console.log("expanding section", thisSection.id);
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
  toggleToggleButtons();
};

//Collapse all subsections (except id and its parents)
const collapseSections = (id) => {
  let anchor = id ? document.getElementById(id) : null;
  document
    .querySelectorAll(
      "section > h2, section > h3, section > h4, section > h5, section > h6"
    )
    .forEach((heading) => {
      let thisSection = heading.closest("section");
      if (
        !id ||
        (!(thisSection.id == id || thisSection.contains(anchor)) &&
          !heading.closest("section").classList.contains("collapsed"))
      ) {
        collapseSection(heading);
      }
    });
};

//Expand all subsections (or just id and its parents)
const expandSections = (id) => {
  let anchor = id ? document.getElementById(id) : null;
  document
    .querySelectorAll(
      "section > h2, section > h3, section > h4, section > h5, section > h6"
    )
    .forEach((heading) => {
      let thisSection = heading.closest("section");
      if (
        (!id || thisSection.id == id || thisSection.contains(anchor)) &&
        heading.closest("section").classList.contains("collapsed")
      ) {
        expandSection(heading);
      }
    });
  if (id) {
    setTimeout(() => {
      location.hash = id;
      anchor.scrollIntoView(true);
    }, 500);
  }
};
//Collapse all subsections, except id and its parents, expand those instead
const collapseOthersExpandAnchor = () => {
  let anchor = location.hash.substring(1);
  if (anchor) {
    collapseSections(anchor);
    expandSections(anchor);
    document.getElementById(anchor).scrollIntoView(true);
  }
};
document.addEventListener("DOMContentLoaded", collapseOthersExpandAnchor);

//Initialized toggle all sections buttons
const initToggleAllSections = () => {
  if (document.querySelector("main > section")) {
    let toggleAllControls = document.createElement("div");
    toggleAllControls.classList.add("toggleAllControls");
    toggleAllControls.innerHTML = `
    <a class="expandAll" onClick="expandSections()">Expand All</a>
    <a class="anchorTarget" onClick="collapseOthersExpandAnchor()">${location.hash}</a>
    <a class="collapseAll" onClick="collapseSections()">Collapse All</a>
  `.trim();
    document.querySelector("main").prepend(toggleAllControls.cloneNode(true));
    document.querySelector("main").append(toggleAllControls.cloneNode(true));
  }
};
document.addEventListener("DOMContentLoaded", initToggleAllSections);

//Toggle (dis)ability of toggle all sections buttons as appropriate
const toggleToggleButtons = () => {
  let anchorId = location.hash;
  let anchor = anchorId ? document.querySelector(anchorId) : null;
  let collapsedSections = document.querySelectorAll(
    "section.toggleable.collapsed"
  );
  if (collapsedSections.length > 0) {
    document.querySelectorAll(".expandAll").forEach((el) => {
      el.classList.remove("disabled");
    });
  } else {
    document.querySelectorAll(".expandAll").forEach((el) => {
      el.classList.add("disabled");
    });
  }
  let uncollapsedSections = document.querySelectorAll(
    "section.toggleable:not(.collapsed)"
  );
  if (uncollapsedSections.length > 0) {
    document.querySelectorAll(".collapseAll").forEach((el) => {
      el.classList.remove("disabled");
    });
  } else {
    document.querySelectorAll(".collapseAll").forEach((el) => {
      el.classList.add("disabled");
    });
  }
  if (anchor) {
    document.querySelectorAll(".anchorTarget").forEach((el) => {
      el.textContent = document
        .querySelector(anchorId)
        .querySelector("h2, h3, h4, h5, h6").textContent;
      el.classList.remove("disabled");
    });
    if (
      anchor.classList.contains("collapsed") ||
      anchor.closest(".collapsed") ||
      [...uncollapsedSections].some(
        (section) =>
          !(
            section.id == anchorId.substring(1) ||
            section.querySelector(anchorId)
          )
      )
    ) {
      document.querySelectorAll(".anchorTarget").forEach((el) => {
        el.classList.remove("disabled");
      });
    } else {
      document.querySelectorAll(".anchorTarget").forEach((el) => {
        el.classList.add("disabled");
      });
    }
  } else {
    document.querySelectorAll(".anchorTarget").forEach((el) => {
      el.classList.add("disabled");
    });
    document.querySelectorAll(".anchorTarget").forEach((el) => {
      el.textContent = " ";
    });
  }
};
document.addEventListener("DOMContentLoaded", toggleToggleButtons);
window.addEventListener("hashchange", toggleToggleButtons);

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
