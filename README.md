`@retailmenot/grunt-hooks`
==========================

Grunt multi-task for installing predefined git hooks.

# Usage

Place any git hooks you'd like installed in a `<project root>/grunt/hooks/` directory (this location can be overridden).

Add options to your Gruntfile for each hook you'd like to prompt the user about.

## Sample Config

```javascript
{
    main: {
        options: {
            onDone: 'Thanks for being a good citizen and using the hooks.',
            hooks: [ {
                name: 'post-commit',
                hookType: 'post-commit',
                description: [
                    'inform the dev about the current state of the branch.',
                    'This will spit out jshint errors, but not fail if present.'
                ].join( '\n' )
            }, {
                name: 'pre-push',
                hookType: 'pre-push',
                description: 'ensure that there are no build or workflow-breaking issues.'
            }, {
                name: 'prepare-commit-msg',
                hookType: 'prepare-commit-msg',
                description: [ 'prepend commit messages with the',
                    'proper tag for branches that match the UI-* naming pattern.'
                ].join( '\n' )
            } ]
        }
    }
}
```

## Options

### onDone

String to present to the user after they have stepped through all of the hooks.

### hookDir

Override the default directory from which hooks are sourced. (`<project root>/grunt/hooks/`)

### hooks[]

Array of objects. Each object specifies options for a particular hook.

#### hook options

| Key | Description |
| --- | ----------- |
| name | Canonical name for the hook. This should be user readable. |
| hookType | The type of hook this should be installed as. This should correspond to one of the possible [git hooks](http://git-scm.com/book/be/v2/Customizing-Git-Git-Hooks). |
| description | Describe what the hook does. This will be prepended with "This hook will", so the description should pick up and finish that sentence. |

## Flags

### --no-prompt

Causes the task to run without prompting the user. It is assumed that all questions are answered yes. This means running with this option will overwrite existing hooks of the same name within the repo.

## Sample Run of Hooks

```bash
$ grunt hooks
Running "hooks:main" (hooks) task
post-commit
===========
This hook will inform the dev about the current state of the branch.
This will spit out jshint errors, but not fail if present.

Do you want to install this hook?
prompt: Y/N?:  y
A hook already exists at .git/hooks/post-commit. Do you wish to overwrite it?
prompt: Y/N?:  y
Installed post-commit hook in .git/hooks/post-commit
pre-push
========
This hook will ensure that there are no build or workflow-breaking issues.

Do you want to install this hook?
prompt: Y/N?:  y
grunt/hooks/pre-push .git/hooks/pre-push pre-push
Installed pre-push hook in .git/hooks/pre-push
prepare-commit-msg
==================
This hook will prepend commit messages with the
proper tag for branches that match the UI-* naming pattern.

Do you want to install this hook?
prompt: Y/N?:  y
y
A hook already exists at .git/hooks/prepare-commit-msg. Do you wish to overwrite it?
prompt: Y/N?:  y
Installed prepare-commit-msg hook in .git/hooks/prepare-commit-msg

Thanks for being a good citizen and using the hooks.

Done, without errors.
```
