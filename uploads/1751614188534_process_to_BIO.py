#绝大多数代码来源于chatGPT
#ssh -p 50212 root@yedbj58rvhmnkur6snow.deepln.com
import json
import re

#开发/测试集比例
#算法就是原始数据里前0.1归dev,然后0.1归test,剩的都给train
dev=0
test=0

def extract_long(line):
    data = json.loads(line)
    passage = data['body']['messages'][1]['content']
    
    #有些地方使用了空格，程序识别不了，这里就直接全换成下划线了
    passage=re.sub(r'\s+', '_', passage)
    
    matches = re.findall(r'\[\"(.*?)\"\]', passage)

    # 如果找到了匹配项，提取并处理
    if matches:
        passage = matches[0]
    else:
        #有一部分的数据内容是："从下面的文字中提取专业术语，用|分隔，只输出术语，不要输出多余信息：NULL"
        #这部分直接删除
        passage = "" 
        
    # 删除标签
    passage = re.sub(r'<[^>]*>', '', passage)
    
    return passage

def extract_short(line):
    data = json.loads(line)
    print(data['response']['body']['request_id'])
    data=data['response']['body']['choices'][0]['message']['content']
    if data == "NULL|术语|专业术语":
        return ""
    
    #处理
    # 删除标签
    data = re.sub(r'<[^>]*>', '', data)
    #result_9k中，有些词,如CN202010153032.0_50365没有用|分割而是用了空格
    #这里就简单的，如果没有|，就把空格换成|,否则换成_
    if '|' in data:
        data=re.sub(r'\s+', '_', data)
    else:
        data=re.sub(r'\s+', '|', data)
    #有些地方会出现不匹配的英文括号，影响正则表达式，这里把正则表达式的关键词直接全换成转义过的
    #如result_9k中，id为CN202211054832.2_58704的第一个关键词有一个不匹配的右括号
    data=re.sub(r'([\\.[\]{}()*+?^$])', r'\\\1', data)
    
    return data

def process_text_to_bio(text, words_regex):
    # 创建正则表达式模式
    pattern = re.compile(words_regex)
    
    # 初始化BIO标记列表
    bio_output = []
    
    # 当前处理的位置
    last_end = 0
    
    # 查找所有匹配的词
    for match in pattern.finditer(text):
        start, end = match.span()
        
        # 处理匹配前的字符
        for i in range(last_end, start):
            if i < len(text):
                bio_output.append((text[i], 'O'))
        
        # 处理匹配到的词
        if start < len(text):
            bio_output.append((text[start], 'B-LOC'))
        for i in range(start + 1, end):
            if i < len(text):
                bio_output.append((text[i], 'I-LOC'))
        
        # 更新上次匹配结束的位置
        last_end = end
    
    # 处理文本末尾未被匹配到的字符
    for i in range(last_end, len(text)):
        if i < len(text):
            bio_output.append((text[i], 'O'))
    
    return bio_output

def process_jsonl_file(words_path,passage_path, output_words_path,output_passage_path,output_dev_path,output_test_path,output_train_path):
    with open(words_path, 'r', encoding='utf-8') as file1, \
         open(passage_path, 'r', encoding='utf-8') as file2, \
         open(output_words_path, 'w', encoding='utf-8') as outfileword, \
         open(output_passage_path, 'w', encoding='utf-8') as outfilepassage, \
         open(output_dev_path, 'w', encoding='utf-8') as outfiledev, \
         open(output_test_path, 'w', encoding='utf-8') as outfiletest, \
         open(output_train_path, 'w', encoding='utf-8') as outfiletrain:
        lines1 = file1.readlines()
        lines2 = file2.readlines()
        dev_=int(len(lines1)*dev)
        test_=int(len(lines1)*(test+dev))
        for i in range(len(lines1)):
            words = extract_short(lines1[i])
            passage = extract_long(lines2[i])
            if passage == "" or words == "":
                continue
            
            #保存已处理的数据 
            json.dump(words, outfileword,ensure_ascii=False)
            outfileword.write('\n')
            outfilepassage.write(passage+'\n')
            
            
            bio_result = process_text_to_bio(passage, words)
            
            if(i<dev_):
                for char, tag in bio_result:
                    outfiledev.write(f"{char} {tag}"+'\n')
                outfiledev.write('\n')
            elif(dev_<=i and i<test_):
                for char, tag in bio_result:
                    outfiletest.write(f"{char} {tag}"+'\n')
                outfiletest.write('\n')
            else:
                for char, tag in bio_result:
                    outfiletrain.write(f"{char} {tag}"+'\n')
                outfiletrain.write('\n')

# 指定输入和输出文件的完整路径
words_path='D:/result_9k.jsonl'
passage_path='D:/t_9k.jsonl'
output_words_path='D:/result_9k1.jsonl'
output_passage_path='D:/t_9k1.jsonl'
output_dev_path='D:/example_9k.dev'
output_test_path='D:/example_9k.test'
output_train_path='D:/example_9k.all'

process_jsonl_file(words_path,passage_path, output_words_path,output_passage_path,output_dev_path,output_test_path,output_train_path)
