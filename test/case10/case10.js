;((rc) => {
  'use strict';
  var tagContent = 'router3';

  var div = document.createElement('div');
  div.innerHTML = `
    <${tagContent} hash="case10-1" hidden>
      case 10-1
      <${tagContent} hash="case10-11">
        case 10-11

        <!-- Default -->
        <${tagContent} id="defA" hash="">
          Default 10-default A
        </${tagContent}>

        <${tagContent} hash="case10-111">
          case 10-111
        </${tagContent}>

        <!-- Default -->
        <${tagContent} id="defB" hash="">
          Default 10-default B
        </${tagContent}>
      </${tagContent}>

      <!-- Default -->
      <${tagContent} id="defC" hash="">
        case 10-default C
      </${tagContent}>
    </${tagContent}>

    <!-- Default -->
    <${tagContent} id="def" hash="">
      case 10-default
    </${tagContent}>
  `;

  var async1 = async_test('Case 10: hash changed to content[hash="case10-1"]');
  var async2 = async_test('Case 10: hash changed to content[hash="case10-1/case10-11"]');
  //var async3 = async_test('Case 10: hash changed to content[hash="case10-1/case10-11/case10-111"]');

  async1.next = async1.step_func(_ => {
    var hash = "case10-1";
    var content1 = document.querySelector(`${tagContent}[hash="${hash}"]`);
    var content2 = document.querySelector(`${tagContent}#def`);
    var content3 = document.querySelector(`${tagContent}#defC`);

    assert_true(content1.hidden);

    var check_hash_1 = async1.step_func((e) => {
      assert_false(content1.hidden);
      assert_true(content2.hidden);
      assert_false(content3.hidden);

      content1.removeEventListener('show', check_hash_1);
      content1.addEventListener('hide', check_hash_def);
      window.location.hash = '';
    });

    var check_hash_def = async1.step_func(e => {
      setTimeout(_ => {
        assert_false(content2.hidden);
        async1.done();
        async2.next();
      }, 10);
      content1.removeEventListener('hide', check_hash_def);
    });

    content1.addEventListener('show', check_hash_1);
    window.location.hash = hash;
  });

  async2.next = async2.step_func(_ => {
    var hash = "case10-11";
    var content1 = document.querySelector(`${tagContent}[hash="${hash}"]`);
    var content2 = document.querySelector(`${tagContent}#def`);
    var content3 = document.querySelector(`${tagContent}#defC`);
    var content4 = document.querySelector(`${tagContent}#defB`);
    var content5 = document.querySelector(`${tagContent}#defA`);

    var check_hash_1 = async2.step_func((e) => {
      assert_false(content1.hidden);
      assert_true(content2.hidden);
      assert_true(content3.hidden);
      assert_false(content4.hidden);
      assert_false(content5.hidden);

      content1.removeEventListener('show', check_hash_1);
      content1.addEventListener('hide', check_hash_def);
      window.location.hash = '';
    });

    var check_hash_def = async2.step_func(e => {
      setTimeout(_ => {
        assert_true(content4.hidden);
        assert_true(content5.hidden);
        async2.done();

        document.body.removeChild(div);
        rc.next();
      }, 10);
      content1.removeEventListener('hide', check_hash_def);
    });

    content1.addEventListener('show', check_hash_1);
    window.location.hash = "case10-1/" + hash;
  });

  rc.push(_ => {
    async1.step(_ => {
      document.body.appendChild(div);
      async1.next();
    });
  })

})(window.routeCases);
