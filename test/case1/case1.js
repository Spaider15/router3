;(_ => {
  'use strict';
  var tagContent = 'router2-content';
  var tagView = 'router2-view';

  // reset in order to begin the test... you should delete this line
  window.location.hash = '';

  var div = document.createElement('div');
  div.innerHTML = `
    <a href="#">Reset</a>
    <a href="#a-hash-template">first case</a>
    <a href="#another-hash-template">second case</a>
    <button>Test</button>
    <router2-content id="first-id" hash="a-hash-template" hidden>
      The content to render
    </router2-content>

    <router2-content id="second-id" hash="another-hash-template" hidden>
      This is another hash
    </router2-content>

    <router2-view for="second-id">
    </router2-view>

    <script>
      document.querySelector('button').addEventListener('click', (e) => {
        location.hash = "myHash";
      });
    </script>
  `;
  document.body.appendChild(div);
  test(_ => {
    assert_true(window.location.hash === '' || window.location.hash === '');
  }, 'The location starts with no hash');

  var async1 = async_test('hash changed for content[hash="a-hash-template"]');
  var async2 = async_test('hash changed for content[hash="another-hash-template"]');
  var async3 = async_test('click over href="#a-hash-template"');
  var async4 = async_test('click over href="#another-hash-tempate"');

  async1.next = async1.step_func(_ => {
    var hash = "a-hash-template";
    var content = document.querySelector(`${tagContent}[hash="${hash}"]`);
    assert_true(content.hidden);
    var hashAsync = async_test(`If change hash to "${hash}" then show its content`);

    var check_hash = hashAsync.step_func((e) => {
      assert_false(content.hidden);

      // clean the test
      window.removeEventListener('hashchange', check_hash);
      window.location.hash = '';

      hashAsync.done();
      async1.done();
      async2.next();
    });

    window.addEventListener('hashchange', check_hash);
    window.location.hash = hash;
  });

  async2.next = async2.step_func(_ => {
    var hash = "another-hash-template";
    var content = document.querySelector(`${tagContent}[hash="${hash}"]`);
    assert_true(content.hidden);

    var hashAsync = async_test(`If change hash to "${hash}" then show its content`);

    var check_hash = hashAsync.step_func((e) => {
      assert_false(content.hidden);

      // clean the test
      window.removeEventListener('hashchange', check_hash);
      window.location.hash = '';

      hashAsync.done();
      async2.done();
      async3.next();
    });

    window.addEventListener('hashchange', check_hash);
    window.location.hash = hash;

  });

  async3.next = async3.step_func(_ => {
    var hash = "a-hash-template";
    var content = document.querySelector(`${tagContent}[hash="${hash}"]`);
    assert_true(content.hidden);
    var hashAsync = async_test(`If click over a[href="${hash}"] then show its content`);

    var check_hash = hashAsync.step_func((e) => {
      assert_false(content.hidden);

      // clean the test
      window.removeEventListener('hashchange', check_hash);
      window.location.hash = '';

      hashAsync.done();
      async3.done();
      async4.next();
    });

    window.addEventListener('hashchange', check_hash);
    document.querySelector(`a[href="#${hash}"]`).dispatchEvent(new Event('click'));
  });

  async4.next = async4.step_func(_ => {
    var hash = "another-hash-template";
    var content = document.querySelector(`${tagContent}[hash="${hash}"]`);
    assert_true(content.hidden);

    var hashAsync = async_test(`If click over a[href="${hash}"] then show its content`);

    var check_hash = hashAsync.step_func((e) => {
      assert_false(content.hidden);

      // clean the test
      window.removeEventListener('hashchange', check_hash);
      window.location.hash = '';

      hashAsync.done();
      async4.done();
      document.body.removeChild(div);
    });

    window.addEventListener('hashchange', check_hash);
    document.querySelector(`a[href="#${hash}"]`).dispatchEvent(new Event('click'));
  });

  async1.step(_ => {
    async1.next();
  });

})();
