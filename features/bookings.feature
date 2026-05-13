Feature: Booking tickets
  
    Scenario: Should booking one standart-ticket
        Given user is on main page
        When user selects the day number 2 in navigation menu
        When user selects session ID "217" 
        Then user sees the hall scheme
        When user selects "chair_standart" 
        And user push the button "Забронировать"
        Then user sees title of the movie 'Сталкер(1979)'
        And numbers of booking tickets 1

    @only
    Scenario: Should booking 3 VIP tickets
        Given user is on main page
        When user selects the day number 5 in navigation menu
        When user selects session ID "225" 
        Then user sees the hall scheme
        When user selects 3 VIP places 
        And user push the button "Забронировать"
        Then user sees title of the movie 'Ведьмак' 
        And numbers of booking tickets 3    


    Scenario: Should booking taken places
        Given user is on main page
        When user selects the day number 6 in navigation menu
        When user selects session ID "240" 
        Then user sees the hall scheme
        When user selects "chair_taken" 
        Then the button "Забронировать" disabled   