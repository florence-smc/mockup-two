$(() => {
  var pro1Title = $('#pro1').html();
  var pro2Title = $('#pro2').html();
  var pro1asin  = $('#pro1asin').html();
  var pro2asin  = $('#pro2asin').html();
  var image1 = $('#prodImg1').html();
  var image2 = $('#prodImg2').html();
  console.log(pro1Title);
  console.log(pro2Title);
  function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }
  const category = GetURLParameter('category');
  const brand1   = GetURLParameter('brand1');
  const brand2   = GetURLParameter('brand2');
  const renderWinnerVoteCount = function (scoreObj) {
    return `
      <div class="vote-results">
        <span > The product you voted has : ${scoreObj.winner.score} % votes! </span>
        <div class="percentage">
          <span id='span' style="width: ${scoreObj.winner.score}%"></span>
        </div>
      </div>
    `;
  }
  const renderLoserVoteCount = function(scoreObj) {
    return `
      <div class="vote-results">
        <span > versus : ${scoreObj.loser.score} % </span>
        <div class="percentage">
          <span id='span' style="width:${scoreObj.loser.score}%"></span>
        </div>
      </div>
    `;
  }
  const renderNextButton = function() {
    return `
      <input type    ="button" id="next"
             value   ="Next Pair"
             onClick ="window.location.reload()">
    `;
  }
  const userWinner = (e) => {
    return `
      <div class="vote-results">
        <span > Congratulation! You've earned 10 points!!!</span>
      </div>
    `;
  }
  const userLooser = (e) => {
    return `
      <div class="vote-results">
        <span > You lost the battle but not the war!Keep fighting!</span>
      </div>
    `;
  }

  // POINTS TRACKER LOGIC
  const calcPoints = () => {
    if (!localStorage['voterPoints']) {
      localStorage.setItem('voterPoints', 10);
      return `<div class="meter">
        <span style="width:1%"></span>
      </div>`
    } else {
      var currentPoints = parseInt(localStorage.getItem('voterPoints'));
      localStorage.setItem('voterPoints', (currentPoints + 10))
      return `<div class="meter">
        <span style="width:${currentPoints}%"></span>
      </div>`
    }

    console.log(localStorage.getItem('voterPoints'));
    console.log(`CURRENT POINTS: ${localStorage.getItem('voterPoints')}`);
    trackPoints()
  }

  const trackPoints = () => {
    const userPoint = localStorage.getItem('voterPoints');
    return `<div class="meter">
      <span style="width:${userPoint || 1}%"></span>
    </div>`
  }

  $('#pointsCnt').html(trackPoints());

  $('#votePro1').click(function(ev) {
    ev.preventDefault();
    const data = {
      votedPro: pro1Title,
      votedAsin: pro1asin,
      unvotedPro: pro2Title,
      unvotedAsin: pro2asin
    };
    console.log('clicked');
    $.ajax({
      method: "POST",
      url: "/search/product",
      data: data
    })
    .done(() => {
      console.log('second ajax');
      $.ajax({
        method: "POST",
        url: "/votes",
        data: data
      })
      .done(function(voteResults) {
        console.log('second ajax response');
        console.log(voteResults);
        const winnerResult = renderWinnerVoteCount(voteResults);
        const loserResult = renderLoserVoteCount(voteResults);
        const nextButton = renderNextButton();
        // $('#winner-container').html(winnerResult);
        // $('#loser-container').html(loserResult);

          if(voteResults.winner.score >= voteResults.loser.score){
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userWinner);
            $('#message-container').css('font-size', '38px');
            $('#pointsCnt').html(calcPoints());
            $('#nextBtn').html(nextButton);
          } else {
            $('#pointsCnt').html(trackPoints());
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userLooser);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          }
      });
    })
  });
  $('#votePro2').click(function(ev) {
    ev.preventDefault();
    const data = {
      votedPro: pro2Title,
      votedAsin: pro2asin,
      unvotedPro: pro1Title,
      unvotedAsin: pro1asin
    };
    console.log('clicked');
    $.ajax({
      method: "POST",
      url: "/search/product",
      data: data
    })
    .done(() => {
      console.log('second ajax');
      $.ajax({
        method: "POST",
        url: "/votes",
        data: data
      })
      .done(function(voteResults) {
        console.log('second ajax response');
        console.log(voteResults);
        const winnerResult = renderWinnerVoteCount(voteResults);
        const loserResult = renderLoserVoteCount(voteResults);
        const nextButton = renderNextButton();
        // $('#winner-container').html(winnerResult);
        // $('#loser-container').html(loserResult);

          if(voteResults.winner.score >= voteResults.loser.score){
            $('#pointsCnt').html(calcPoints());
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userWinner);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          } else {
            $('#pointsCnt').html(trackPoints());
            $('#winner-container').html(winnerResult);
            $('#loser-container').html(loserResult);
            $('#message-container').html(userLooser);
            $('#message-container').css('font-size', '38px');
            $('#nextBtn').html(nextButton);
          }
      });
    })
  })

  $('#logout').click( (e) => {
      localStorage.clear();
      window.location = '/users/logout';
      return false;
  });

  // $('#logout').click(function()
  // {
  //   $.ajax({
  //     method:"POST",
  //     url: "/users/register",
  //     data:{
  //       email: email,
  //       password: password
  //     }
  //   }).done((e) =>{
  //     localStorage.clear();
  //     location.reload();
  //     return false;
  //
  //   })
  //
  //     });
  // });

})
