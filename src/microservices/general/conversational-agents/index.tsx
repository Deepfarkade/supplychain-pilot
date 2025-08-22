import React, { useState } from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, MessageSquare } from 'lucide-react';

const ConversationalAgents: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: 'Thank you for your message. This is a demo response from the conversational agent.'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const breadcrumbs = [
    { label: 'General' },
    { label: 'Conversational Agents' }
  ];

  return (
    <MicroserviceShell
      title="Conversational Agents"
      description="Test deployed models with customizable chatbot interface, translation and personalized prompts"
      icon={MessageSquare}
      breadcrumbs={breadcrumbs}
      layout={{ fullBleed: true, header: 'compact', padding: 'md' }}
      metadata={{
        title: 'Conversational Agents - AI Chat Interface',
        description: 'Interactive AI chatbot with customizable prompts and translation capabilities'
      }}
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          <Badge variant="secondary">AI Chat</Badge>
          <Badge variant="secondary">NLP</Badge>
          <Badge variant="secondary">Translation</Badge>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Chat Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary' : 'bg-accent'}`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <Bot className="h-4 w-4 text-accent-foreground" />
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MicroserviceShell>
  );
};

export default ConversationalAgents;