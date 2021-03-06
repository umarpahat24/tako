Tako.Aside = do (TK = Tako) ->
  aside = $ "aside"
  _showing = false

  if aside.length > 0
    bck = null
    header = aside.children("header")
    aside.append $(document.createElement("div")).append(aside.children())
    aside.prepend header

    bck = $ '<div data-element="aside_background"></div>'
    $("body").append bck
    bck.addClass "full" if aside.hasClass "full"

    show = ->
      bck.removeClass("hide").addClass "show"
      aside.addClass "show"

    hide = ->
      aside.removeClass "show"
      bck.addClass "hide"

    toggle = ->
      if TK.viewType() is "PHONE"
        if aside.hasClass "show" then hide() else show()

    $("aside *").each (index) ->
      $(@).on "click", (ev)->
        if _showing
          do ev.preventDefault
          do ev.stopPropagation
          do hide
      $(@).on "click", (ev)->
        if _showing
          do hide
          do ev.preventDefault
          do ev.stopPropagation

    bck.on "click", (ev)->
      if _showing
        do ev.preventDefault
        do ev.stopPropagation
        do hide

    TK.onReady ->
      aside.on "transitionend webkitTransitionEnd mozTransitionEnd otransitionend MSTransitionEnd", (event) ->
        _showing = aside[0].classList.contains("show")
      bck.on "transitionend webkitTransitionEnd mozTransitionEnd otransitionend MSTransitionEnd", (event) ->
        if not aside[0].classList.contains("show")
          bck.removeClass "show"


    show    : show
    hide    : hide
    toggle  : toggle