function copyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function adjustTextDirection(textarea) {
  var char = textarea.value.charAt(0);
  var isArabic = /[\u0600-\u06FF]/.test(char);
  textarea.style.direction = isArabic ? 'rtl' : 'ltr';
}


 class ChatAI {
 
     constructor(options) {
         let defaults = {
             source: 'jokabot',
             model: 'gpt-4-32k',
             conversations: [],
             selected_conversation: null,
             container: '.chat-ai',
             chat_speed: 0,
             title: 'Joka Bot',
             max_tokens: 100,
             version: '1.0.0',
             show_tokens: true,
         };
         this.options = Object.assign(defaults, options);
         this.options.container = document.querySelector(this.options.container);
         this.options.container.innerHTML = `
             ${this._sidebarTemplate()}
             <main class="content">               
                 ${this._welcomePageTemplate()}
              <form class="message-form">
                <textarea rows="1" placeholder="اكتب رسالتك إلى جوكه..." required minlength="2" style="resize: none; overflow-y: auto;" oninput="adjustTextDirection(this)"></textarea>
                <button type="submit"><i class="fa-solid fa-paper-plane"></i></button>
              </form>
             </main>
         `;
         let settings = this.getSettings();
         if (settings) {
             this.options = Object.assign(this.options, settings);
         }
         this._eventHandlers();
         this.container.querySelector('.message-form textarea').focus();
     }

     getMessage() {
        this.container.querySelector('.content .messages').scrollTop = this.container.querySelector('.content .messages').scrollHeight;
        this.container.querySelector('.message.assistant.active .blink').remove();
        let msg  = `Hello, I'm Joka, I'll be in service soon, this is just a first design to be tested before the final version is released.
- Additional information :
\`\`\`~~> The use will not be complicated, this is very simple, as is the case with the rest of the artificial intelligence tools,

~~> Joka is also your smart friend who helps you in everything,

~~> but what is distinguished from the best AI tools is the mode of (JokHack) of the modified version of OpenAi (outlaw),

~~> for more information about this thing, see the bot channel in Telegram \`\`\`
             
- The site will be announced when it is completed in our Instagram account:
\`\`\`https://instagram.com/221298\`\`\`

- Or on the bot channel in Telegram:
\`\`\`https://t.me/Joka2_bot\`\`\`


see (:`;

        let msgElement = this.container.querySelector('.message.assistant.active .text');
        let textInterval = setInterval(() => {
        if (msg[0]) {
        msgElement.innerText += msg[0];
        msg = msg.substring(1);
        } else {
        clearInterval(textInterval);
        msgElement.innerHTML = msgElement.innerText.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
        this.container.querySelector('.message-form textarea').disabled = false;
        this.container.querySelector('.message.assistant.active').classList.remove('active');
        Prism.highlightAll();
            }
            this.container.querySelector('.content .messages').scrollTop = this.container.querySelector('.content .messages').scrollHeight;
        }, this.options.chat_speed);}
 
 
     showErrorMessage(message) {
         this.container.querySelectorAll('.error').forEach(error => error.remove());
         let error = document.createElement('div');
         error.classList.add('error-toast');
         error.innerHTML = message;
         this.container.appendChild(error);
         error.getBoundingClientRect();
         error.style.transition = 'opacity .5s ease-in-out 4s';
         error.style.opacity = 0;
         setTimeout(() => error.remove(), 5000);
     }
 
     showSuccessMessage(message) {
         this.container.querySelectorAll('.success').forEach(success => success.remove());
         let success = document.createElement('div');
         success.classList.add('success-toast');
         success.innerHTML = message;
         this.container.appendChild(success);
         success.getBoundingClientRect();
         success.style.transition = 'opacity .5s ease-in-out 4s';
         success.style.opacity = 0;
         setTimeout(() => success.remove(), 5000);
     }
 
     formatElapsedTime(dateString) {
         let date = new Date(dateString);
         let now = new Date();
         let elapsed = now - date;
         let seconds = Math.floor(elapsed / 1000);
         let minutes = Math.floor(seconds / 60);
         let hours = Math.floor(minutes / 60);
         let days = Math.floor(hours / 24);
         if (days > 1) {
             return `${days} days ago`;
         } else if (days === 1) {
             return 'Yesterday';
         } else if (hours > 0) {
             return `${hours} hours ago`;
         } else if (minutes > 0) {
             return `${minutes} minutes ago`;
         } else {
             return `${seconds} seconds ago`;
         }
     }
 
     loadConversation(obj) {
         this.clearWelcomeScreen();
         this.clearMessages();
         this.container.querySelector('.content .messages').insertAdjacentHTML('afterbegin', `
             <div class="conversation-title">
                 <h2><span class="text">${obj.name}</span><i class="fa-solid fa-pencil edit"></i></h2>
             </div>
         `);
         this._conversationTitleClickHandler();
         obj.messages.forEach(message => {
             this.container.querySelector('.content .messages').insertAdjacentHTML('afterbegin', `
                 <div class="message ${message.role}"> 
                     <div class="wrapper">
                         <div class="avatar">${message.role == 'assistant' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>'}</div>
                         <div class="details">
                             <div class="date" title="${message.date}">${this.formatElapsedTime(message.date)}</div>
                             <div class="text">
                              ${message.content.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/```(.*?)```/g, "<pre><code class='language-javascript'>$1</code></pre>")}
                          </div>
                         </div>
                     </div>
                 </div>
             `);
         });
     }
 
     clearWelcomeScreen() {
         if (this.container.querySelector('.content .welcome')) {
             this.container.querySelector('.content .welcome').remove();
             this.container.querySelector('.content').insertAdjacentHTML('afterbegin', '<div class="messages"></div>');
             return true;
         }
         return false;
     }
 
     clearMessages() {
         if (this.container.querySelector('.content .messages')) {
             this.container.querySelector('.content .messages').innerHTML = '';
             return true;
         }
         return false;
     }
 
     createNewConversation(title = null) {  
         title = title != null ? title : 'CHAT ' + (this.conversations.length + 1)+' ⭐';
         let index = this.conversations.push({ name: title, messages: [] });
         this.container.querySelectorAll('.conversations .list a').forEach(c => c.classList.remove('selected'));
         this.container.querySelector('.conversations .list').insertAdjacentHTML('beforeend', `<a class="conversation selected" href="#" data-id="${index - 1}" title="${title}"><i class="fa-regular fa-message"></i>${title}</a>`);
         this.clearWelcomeScreen();
         this.clearMessages();
         this._conversationClickHandlers();
         this.container.querySelector('.content .messages').innerHTML = '<div class="conversation-title"><h2><span class="text">' + title + '</span><i class="fa-solid fa-pencil edit"></i></h2></div>';
         this._conversationTitleClickHandler();
         this.container.querySelector('.message-form textarea').focus();
         this.updateTitle();
         return index - 1;
     }
 
     updateTitle(unsaved = true) {
         document.title = unsaved ? '* ' + this.options.title.replace('* ', '') : this.options.title.replace('* ', '');
     }
 
     modal(options) {
         let element;
         if (document.querySelector(options.element)) {
             element = document.querySelector(options.element);
         } else if (options.modalTemplate) {
             document.body.insertAdjacentHTML('beforeend', options.modalTemplate());
             element = document.body.lastElementChild;
         }
         options.element = element;
         options.open = obj => {
             element.style.display = 'flex';
             element.getBoundingClientRect();
             element.classList.add('open');
             if (options.onOpen) options.onOpen(obj);
         };
         options.close = obj => {
             if (options.onClose) {
                 let returnCloseValue = options.onClose(obj);
                 if (returnCloseValue !== false) {
                     element.style.display = 'none';
                     element.classList.remove('open');
                     element.remove();
                 }
             } else {
                 element.style.display = 'none';
                 element.classList.remove('open');
                 element.remove();
             }
         };
         if (options.state == 'close') {
             options.close({ source: element, button: null });
         } else if (options.state == 'open') {
             options.open({ source: element }); 
         }
         element.querySelectorAll('.modal-close').forEach(e => {
             e.onclick = event => {
                 event.preventDefault();
                 options.close({ source: element, button: e });
             };
         });
         return options;
     }
 
     
 
     getSettings() {
         return localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : false;
     }
    
     _welcomePageTemplate() {
         return `
             <div class="welcome">
                 <h1>Joka Bot<span class="ver">HK</span></h1>                    
                 <p>Developers: Hassan Al-Emadi & MR.Joker</p>
             </div>
         `;
     }
 
     _sidebarTemplate() {
         return `
             <a href="#" class="open-sidebar" title="Open Sidebar"><i class="fa-solid fa-bars"></i></a>
             <nav class="conversations">
                <div class="menubar">
                    <label class="slider-container">
                      <input type="checkbox" id="model-toggle" autocomplete="off">
                      <span class="slider-track">
                        <span class="model-label" id="model-label-left">Joka</span>
                        <div class="slider"></div>
                        <span class="model-label" id="model-label-right">JokHack</span>
                      </span>
                    </label> 
                  </div>
                 <a class="new-conversation" href="#"><i class="fa-solid fa-plus"></i>New Joka chat</a>
                 <div class="list"></div>
                 <div class="footer">
                     <a class="tele" href="https://t.me/vv1ck" title="Telegram"><i class="fab fa-telegram fa-2x"></i></a>
                     <a class="gith" href="https://github.com/vv1ck" title="GitHub"><i class="fab fa-github fa-2x"></i></a>
                     <a class="close-sidebar" href="#" title="Close Sidebar"><i class="fa-solid fa-bars"></i></a>
                 </div>
             </nav>
         `;
     }
 
     _conversationClickHandlers() {
         this.container.querySelectorAll('.conversations .list a').forEach(conversation => {
             conversation.onclick = event => {
                 event.preventDefault();
                 this.container.querySelectorAll('.conversations .list a').forEach(c => c.classList.remove('selected'));
                 conversation.classList.add('selected');
                 this.selectedConversationIndex = conversation.dataset.id;
                 this.loadConversation(this.selectedConversation);
                 this.container.querySelector('.content .messages').scrollTop = this.container.querySelector('.content .messages').scrollHeight;
             };
         });
     }
 
     _conversationTitleClickHandler() {
         this.container.querySelector('.conversation-title i.edit').onclick = () => {
             this.container.querySelector('.conversation-title .text').contentEditable = true;
             this.container.querySelector('.conversation-title .text').focus();
             let update = () => {
                 this.container.querySelector('.conversation-title .text').contentEditable = false;
                 this.selectedConversation.name = this.container.querySelector('.conversation-title .text').innerText;
                 this.container.querySelector('.conversation-title .text').blur();
                 this.container.querySelector('.conversations .list a[data-id="' + this.selectedConversationIndex + '"]').innerHTML = '<i class="fa-regular fa-message"></i>' + this.selectedConversation.name;
                 this.container.querySelector('.conversations .list a[data-id="' + this.selectedConversationIndex + '"]').title = this.selectedConversation.name;
                 this.updateTitle();
             };
             this.container.querySelector('.conversation-title .text').onblur = () => update();
             this.container.querySelector('.conversation-title .text').onkeydown = event => {
                 if (event.keyCode == 13) {
                     event.preventDefault();
                     update();
                 }
             };
         };
     }

 
     _eventHandlers() {
        document.getElementById('model-label-right').onclick = function() {
            var newConversationLink = document.querySelector('.new-conversation');
            newConversationLink.innerHTML = '<i class="fa-solid fa-plus"></i>New JokHack chat';
            document.querySelector('.conversations').style.backgroundColor = "black"; 
        };
    
        document.getElementById('model-label-left').onclick = function() {
            var newConversationLink = document.querySelector('.new-conversation');
            newConversationLink.innerHTML = '<i class="fa-solid fa-plus"></i>New Joka chat';
            document.querySelector('.conversations').style.backgroundColor = "#292c31";
        };
        
      this.container.querySelector('.message-form').onsubmit = event => {
        event.preventDefault();
        this.clearWelcomeScreen();
        if (this.selectedConversation === undefined) {
            this.selectedConversationIndex = this.createNewConversation();
        }
        let date = new Date();
        let userInput = this.container.querySelector('.message-form textarea').value;
        let formattedInput = userInput.replace(/```(.*?)```/gs, "<pre><code class='language-python'>$1</code></pre>");
        this.selectedConversation.messages.push({
            id: "vv1ck",
            role: 'user',
            content: userInput,
            date: date
        });
        this.container.querySelector('.messages').insertAdjacentHTML('afterbegin', `
            <div class="message assistant active">
                <div class="wrapper">
                    <i class="fa-solid fa-robot"></i>
                    <div class="details">
                        <div class="date" data-date="${date}" title="${date}">just now</div>
                        <div class="text"><span class="blink">_</span></div>
                        <button class="copy-btn" onclick="copyText(this.previousElementSibling.innerText)">copy</button>                    </div>
                </div>
            </div>
            <div class="message user">
                <div class="wrapper">
                    <div class="avatar"><i class="fa-solid fa-user"></i></div>
                    <div class="details">
                        <div class="date" data-date="${date}" title="${date}">just now</div>
                        <div class="text">${formattedInput}</div>
                        <button class="copy-btn" onclick="copyText(this.previousElementSibling.innerText)">copy</button>                    </div>
                </div>
            </div>
        `);
        
        this.container.querySelector('.message-form textarea').disabled = true;
        this.getMessage(this.container.querySelector('.message-form textarea').value);
        this.container.querySelector('.message-form textarea').value = '';
        this.updateTitle();
    };
         window.addEventListener('keydown', event => {
             if (event.ctrlKey && event.key === 's') {
                 event.preventDefault();
                 this.saveJsonToFile(this.conversations);
             }
         });
         window.addEventListener('beforeunload', event => {
             if (document.title.startsWith('*') && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
                 event.preventDefault();
                 event.returnValue = '';
             }
         });
         this.container.querySelector('.conversations .new-conversation').onclick = event => {
          event.preventDefault();
          this.selectedConversationIndex = this.createNewConversation();
          this.modal({
            element: '.conversations',
            close: () => {
              this.container.querySelector('.conversations').style.display = 'none';
              this.container.querySelector('.open-sidebar').style.display = 'flex';
            }
          });
        };

        this.container.querySelector('.conversations .new-conversation').onclick = event => {
          event.preventDefault();
          this.selectedConversationIndex = this.createNewConversation();
          this.container.querySelector('.conversations').style.display = 'none';
          this.container.querySelector('.open-sidebar').style.display = 'flex';
        };
         this.container.querySelector('.open-sidebar').onclick = event => {
             event.preventDefault();
             this.container.querySelector('.conversations').style.display = 'flex';
             this.container.querySelector('.open-sidebar').style.display = 'none';
             localStorage.setItem('sidebar', 'closed');
         };
         this.container.querySelector('.close-sidebar').onclick = event => {
             event.preventDefault();
             this.container.querySelector('.conversations').style.display = 'none';
             this.container.querySelector('.open-sidebar').style.display = 'flex';
             localStorage.setItem('sidebar', 'closed');
         };
         
         if (localStorage.getItem('sidebar') === 'closed') {
             this.container.querySelector('.conversations').style.display = 'none';
             this.container.querySelector('.open-sidebar').style.display = 'flex';
         }
         setInterval(() => {
             this.container.querySelectorAll('[data-date]').forEach(element => {
                 element.innerHTML = this.formatElapsedTime(element.getAttribute('data-date'));
             });
         }, 120000);
         this._conversationClickHandlers();
     }
 
 
 
     get conversations() {
         return this.options.conversations;
     }
 
     set conversations(value) {
         this.options.conversations = value;
     }
 
     get selectedConversationIndex() {
         return this.options.selected_conversation;
     }
 
     set selectedConversationIndex(value) {
         this.options.selected_conversation = value;
     }
 
     get selectedConversation() {
         return this.conversations[this.selectedConversationIndex];
     }
 
     set selectedConversation(value) {
         this.conversations[this.selectedConversationIndex] = value;
     } 
     
     get container() {
         return this.options.container;
     }
 
     set container(value) {
         this.options.container = value;
     }
 
 }
 new ChatAI({
     container: '.chat-ai',
     api_key: 'vv1ck',
     model: 'gpt-4-32k',
     max_tokens: 500
 });