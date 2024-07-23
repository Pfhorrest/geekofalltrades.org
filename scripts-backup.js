"use strict";

// Clicking header toggles visibility of menu
$("header > h1").click(function () {
  $("#menu").slideToggle();
});

// Automatically hide menu on mobile
function hideMenuOnMobile() {
  if ($(window).width() < 640) {
    $("#menu").slideUp();
  } else {
    $("#menu").slideDown();
  }
}
$(document).ready(hideMenuOnMobile);
$(window).on("resize", function () {
  hideMenuOnMobile();
});

//Toggle submenus on click
$(document).ready(initMenus);
function initMenus() {
  $("#menu ul li > a").each(function () {
    if ($(this).closest("li").children("ul").length !== 0) {
      $(this).attr("title", "Expand submenu");
      $(this).addClass("submenu");
      $(this).click(function () {
        $(this).closest("li").children("ul").slideToggle();
        $(this).closest("li").toggleClass("current");
        $("body").one("click", function () {
          $("#menu ul li ul").slideUp();
          $("#menu ul li.current").removeClass("current");
        });
        return false;
      });
      $(this).addClass("toggleable");
    }
  });
}

//Toggle sections by clicking their headers
$(document).ready(bindToggleToSectionHeaders);
function bindToggleToSectionHeaders() {
  $(
    "section > h2, section > h3, section > h4, section > h5, section > h6"
  ).each(function () {
    $(this).css("cursor", "pointer");
    $(this).attr("title", "Collapse section");
    $(this).closest("section").addClass("toggleable");
    $(this).one("click", function () {
      collapseSection($(this));
    });
  });
}

//To collapse a section from one of its elements
function collapseSection(element) {
  console.log("collapsing section", element.closest("section")[0].id);
  element
    .closest("section")
    .children()
    .not("h2,h3,h4,h5,h6,.description")
    .fadeOut(500);
  element.closest("section").addClass("collapsed");
  element.attr("title", "Expand section");
  element.one("click", function () {
    expandSection($(this));
  });
}

//Auto-collapse subsections
$(document).ready(autoCollapse);
function autoCollapse() {
  var subsections = $(
    "section > h2, section > h3, section > h4, section > h5, section > h6"
  ).not(function () {
    return (
      $(this).parent("section").parent().is("main") ||
      $(this).parent("section")[0].id == location.hash.substr(1)
    );
  });
  subsections.each(function () {
    collapseSection($(this));
  });
}

//To expand a section (and all parent sections) from one of its elements
function expandSection(element) {
  console.log("expanding section", element.closest("section")[0].id);
  var parents = element.parents("section.collapsed");
  var targets;
  if (element.hasClass("toggleable collapsed")) {
    targets = parents.add(element);
  } else {
    targets = parents;
  }
  targets.each(function (section) {
    $(this).children().not("h2,h3,h4,h5,h6,.description").fadeIn(500);
    $(this).removeClass("collapsed");
    $(this)
      .children("h2,h3,h4,h5,h6")
      .each(function (header) {
        $(this).attr("title", "Collapse section");
        $(this).one("click", function () {
          collapseSection($(this));
        });
      });
  });
  element.closest("section")[0].scrollIntoView(true);
  window.location.hash = element.closest("section")[0].id;
}

//Auto-expand target anchor (and parents)
$(document).ready(autoExpand);
function autoExpand() {
  var targetId = window.location.hash.substr(1);
  if (targetId) {
    var targetSelector = "#" + targetId;
    var target = $(targetSelector);
    expandSection(target);
    setTimeout(function () {
      location.hash = targetId;
    }, 500);
  }
}

// Make external links open in new windows or tabs
$(document).ready(externalLinks);
function externalLinks() {
  var thisdomain = document.location.hostname;
  $("a[href^='http']:not([href*=thisdomain])")
    .click(function () {
      window.open(this.href);
      return false;
    })
    .attr("title", "Opens in a new window");
}

// Gallery modal display functionality

//Initialize global variable of slides
var slides;

//Sets up the structure of the modal (all hidden by default) and the events listeners to open and close it
$(document).ready(initDisplayModal);
function initDisplayModal() {
  //Gathers all the slides into a collection
  slides = $(".gallery img").filter(function () {
    return $(this).closest("a").attr("href").includes("/display/");
  });

  //Adds onclick event to every slide link to open modal display
  slides.each(function (index, element) {
    $(this)
      .closest("a")
      .click(function () {
        currentSlide(index);
        openModal();
        return false;
      });
  });

  //Gets the modal from an external file and appends it after the (last) main element
  if (slides.length !== 0) {
    //Place a wrapper to load the modal into
    $("main").last().after("<div id='modal-placeholder'></div>");
    //Load the modal into there
    $("#modal-placeholder").load(
      "/display/modal.html",
      (responseTxt, statusTxt, xhr) => {
        if (statusTxt == "error") {
          alert("Error: " + xhr.status + ": " + xhr.statusText);
        }
        //And then only once the modal is loaded...
        if (statusTxt == "success") {
          //Unwrap the modal
          $("#displayModal").unwrap();
          $("#displayModal").hide();
          //Add onclick to close modal when clicking background
          $("#displayModal").click(function (event) {
            if (event.target === this) {
              closeModal();
            }
          });
        }
      }
    );
  }
}

//Initializes the slideshow index
var slideIndex = 0;

//Steps forward through the slideshow (or backward if negative)
function plusSlides(n) {
  $("#modalImage").fadeOut("", function () {
    $("#modalImage").attr("src", "");
    showSlides((slideIndex += n));
    $(this).fadeIn();
  });
}

//Sets the slide index as specified
function currentSlide(n) {
  $("#modalImage").attr("src", "");
  showSlides((slideIndex = n));
}

//Populates the modal with the data of the specified slide
function showSlides(n) {
  var i;
  var l = slides.length;
  if (n >= l) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = l - 1;
  }
  var slide = $(slides[slideIndex]);
  var caption = $("#caption");
  var captionText = slide.closest("li").find("h3").first().html();
  caption.html(captionText);
  var image = $("#modalImage");
  var srcstr = String(slide.attr("src")).replace("-thumb", "");
  image.attr("src", srcstr);
  image.attr("alt", captionText);
}

//Opens the modal image display
function openModal() {
  $("#displayModal").show();
  $("#displayModal").animate({ opacity: 1 });
  return false;
}

//Closes the modal image display
function closeModal() {
  $("#displayModal").animate({ opacity: 0 }, function () {
    $("#displayModal").hide();
  });
}
