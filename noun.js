// i need to take a user and ask what that user can do with this noun
// that means i need to be able to pass the noun a role
// and ask what permissions that role can do
'use strict';

class Noun {
  /**
   * @param  {string} name - name of noun
   * @return {noun}        - the created noun
   */
  constructor(name) {
    this.name = name;
    this._afterSetupFns = [];
    this.verbs = new Set();
    this.permissions = {};
    ['create','read','update','delete'].forEach( (v) => this.can(v), this);
  }

  /**
   * pushes fn to list of functions to run after setup
   * @protected
   * @param  {Function} fn will be passed insnatce
   */
  _afterSetup(fn) {
    this._afterSetupFns.push(fn);
  }

  /**
   * Calls all aftersetup methods
   */
  setup() {
    this._afterSetupFns.forEach( (fn) => fn.call(this, this), this);
  }

  /**
   * Checks to see if noun has verb
   * @param  {string}  verb
   * @return {Boolean}
   */
  hasVerb(verb) {
    return this.verbs.has(verb);
  }

  /**
   * Adds verb to the set of posible verbs that can be authorized. For example, `post.can('like')` would add the verb 'like' to a noun 'post'
   * @param  {string} verb
   */
  can(verb) {
    this.verbs.add(verb);
  }

  /**
   * Removes a verb from the set of possible verbs. Useful for removing default crud.
   * @param  {string} verb
   */
  cannot(verb) {
    this.verbs.delete(verb);
  }

  /**
   * Authorizes a role to perform a verb.
   * @param  {string} role
   * @param  {string[]|string} verbs - Either the string '*', which authorizes all possible verbs to the given role, or an array of verbs to authorize.
   */
  authorize(role, verbs) {
    if(verbs === '*') {
      verbs = this.verbs;
    } else {
      verbs = verbs.filter( (v) => this.verbs.has(v), this);
    }
    this.permissions[role] = this.permissions[role] || new Set();
    verbs.forEach( (v) => this.permissions[role].add(v) );
  }

  checkAuthorization(role, verb) {
    return !!this.permissions[role] && this.permissions[role].has(verb);
  }

}


module.exports = Noun;